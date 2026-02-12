import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchResults.css';
import ResultCard from '../components/search/ResultCard';
import FilterPanel from '../components/search/FilterPanel';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Récupérer les résultats passés par Search.jsx
  const [results, setResults] = useState(location.state?.results || []);
  const [searchParams, setSearchParams] = useState(location.state?.searchParams || {});
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 10000,
    rating: 0,
    stops: 'all',
    airlines: [],
    amenities: []
  });

  // Déterminer le type de recherche depuis l'URL
  const searchType = location.pathname.split('/')[2]; // flights, hotels, ou activities

  // Rediriger si aucun résultat n'est disponible
  useEffect(() => {
    if (!location.state || !location.state.results) {
      console.warn('⚠️ Aucun résultat disponible, redirection vers /search');
      navigate('/search');
    }
  }, [location.state, navigate]);

  // Appliquer les filtres et le tri dès que les résultats changent
  useEffect(() => {
    applyFiltersAndSort();
  }, [results, filters, sortBy]);

  const applyFiltersAndSort = () => {
  if (!results || results.length === 0) {
    setFilteredResults([]);
    return;
  }

  let filtered = [...results];

  console.log('🔍 Application des filtres:', filters);
  console.log('📊 Résultats avant filtrage:', filtered.length);

  // 1. Filtre par prix
  filtered = filtered.filter(item => {
    const itemPrice = item.price || item.pricePerNight || 0;
    return itemPrice >= filters.priceMin && itemPrice <= filters.priceMax;
  });
  console.log('📊 Après filtre prix:', filtered.length);

  // 2. Filtre par note
  if (filters.rating > 0) {
    filtered = filtered.filter(item => {
      const itemRating = parseFloat(item.rating) || 0;
      return itemRating >= filters.rating;
    });
    console.log('📊 Après filtre note:', filtered.length);
  }

  // 3. Filtre par escales (vols uniquement)
  if (searchType === 'flights' && filters.stops !== 'all') {
    filtered = filtered.filter(item => {
      const itemStops = parseInt(item.stops) || 0;
      
      if (filters.stops === 'direct') {
        return itemStops === 0;
      } else if (filters.stops === '1stop') {
        return itemStops <= 1;
      }
      
      return true;
    });
    console.log('📊 Après filtre escales:', filtered.length);
  }

  // 4. Filtre par équipements (hôtels uniquement)
  if (searchType === 'hotels' && filters.amenities && filters.amenities.length > 0) {
    filtered = filtered.filter(item => {
      const itemAmenities = item.amenities || [];
      
      // Vérifier que l'hôtel a TOUS les équipements sélectionnés
      return filters.amenities.every(amenity => {
        // Mapper les valeurs du frontend vers le backend
        const amenityMap = {
          'wifi': 'WiFi',
          'pool': 'Piscine',
          'parking': 'Parking',
          'ac': 'Climatisation',
          'restaurant': 'Restaurant'
        };
        
        const backendAmenity = amenityMap[amenity];
        return itemAmenities.includes(backendAmenity);
      });
    });
    console.log('📊 Après filtre équipements:', filtered.length);
  }

  // 5. Filtre par catégorie (activités uniquement)
  if (searchType === 'activities' && filters.category && filters.category !== 'all') {
    filtered = filtered.filter(item => {
      return item.category?.toLowerCase() === filters.category.toLowerCase();
    });
    console.log('📊 Après filtre catégorie:', filtered.length);
  }

  // Application du tri
  switch (sortBy) {
    case 'price_asc':
      filtered.sort((a, b) => {
        const priceA = a.price || a.pricePerNight || 0;
        const priceB = b.price || b.pricePerNight || 0;
        return priceA - priceB;
      });
      break;
    case 'price_desc':
      filtered.sort((a, b) => {
        const priceA = a.price || a.pricePerNight || 0;
        const priceB = b.price || b.pricePerNight || 0;
        return priceB - priceA;
      });
      break;
    case 'rating':
      filtered.sort((a, b) => {
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;
        return ratingB - ratingA;
      });
      break;
    case 'duration':
      if (searchType === 'flights') {
        filtered.sort((a, b) => {
          const durationA = parseDuration(a.duration);
          const durationB = parseDuration(b.duration);
          return durationA - durationB;
        });
      }
      break;
    default:
      break;
  }

  console.log('✅ Résultats finaux après tri:', filtered.length);
  setFilteredResults(filtered);
};

const parseDuration = (duration) => {
  if (!duration) return 0;
  const match = duration.match(/(\d+)h\s*(\d+)?m?/);
  if (match) {
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    return hours * 60 + minutes;
  }
  return 0;
};

  const handleFilterChange = (newFilters) => {
    console.log('🔧 Nouveaux filtres:', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (e) => {
    console.log('🔀 Nouveau tri:', e.target.value);
    setSortBy(e.target.value);
  };

  const getSearchTypeLabel = () => {
    switch(searchType) {
      case 'flights': return 'vols';
      case 'hotels': return 'hôtels';
      case 'activities': return 'activités';
      default: return 'résultats';
    }
  };

  if (isLoading) {
    return (
      <div className="search-results-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Recherche des meilleures offres...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div className="container">
        {/* Paramètres de recherche */}
        <div className="search-summary">
          <button onClick={() => navigate('/search')} className="btn-back">
            ← Modifier la recherche
          </button>
          <div className="search-info">
            {searchType === 'hotels' && (
              <p>
                📍 {searchParams.destination} • 
                📅 {searchParams.checkIn ? new Date(searchParams.checkIn).toLocaleDateString('fr-FR') : ''} - 
                {searchParams.checkOut ? new Date(searchParams.checkOut).toLocaleDateString('fr-FR') : ''} • 
                👥 {searchParams.guests} voyageur{searchParams.guests > 1 ? 's' : ''} • 
                🛏️ {searchParams.rooms} chambre{searchParams.rooms > 1 ? 's' : ''}
              </p>
            )}
            {searchType === 'flights' && (
              <p>
                ✈️ {searchParams.from} → {searchParams.to} • 
                📅 {searchParams.departDate ? new Date(searchParams.departDate).toLocaleDateString('fr-FR') : ''} • 
                👥 {searchParams.passengers} passager{searchParams.passengers > 1 ? 's' : ''}
              </p>
            )}
            {searchType === 'activities' && (
              <p>
                🎯 {searchParams.destination} • 
                📅 {searchParams.date ? new Date(searchParams.date).toLocaleDateString('fr-FR') : ''} • 
                👥 {searchParams.participants} participant{searchParams.participants > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        <div className="results-header">
          <h1 className="results-title">
            {filteredResults.length} {getSearchTypeLabel()} trouvé{filteredResults.length > 1 ? 's' : ''}
          </h1>
          
          <div className="results-controls">
            <div className="sort-control">
              <label htmlFor="sort">Trier par:</label>
              <select 
                id="sort" 
                value={sortBy} 
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="recommended">Recommandé</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="rating">Meilleure note</option>
                {searchType === 'flights' && (
                  <option value="duration">Durée</option>
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="results-layout">
          <aside className="filters-sidebar">
            <FilterPanel 
              searchType={searchType}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          <main className="results-main">
            {filteredResults.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h2>Aucun résultat trouvé</h2>
                <p>
                  {results.length === 0 
                    ? 'La recherche n\'a retourné aucun résultat. Essayez d\'autres critères.'
                    : 'Aucun résultat ne correspond à vos filtres. Essayez d\'ajuster les filtres.'}
                </p>
                <button onClick={() => navigate('/search')} className="btn btn-primary">
                  Nouvelle recherche
                </button>
              </div>
            ) : (
              <div className="results-grid">
                {filteredResults.map((result, index) => (
                  <ResultCard
                    key={result.id || index}
                    result={result}
                    searchType={searchType}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default SearchResults;