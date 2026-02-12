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

    // Application des filtres
    filtered = filtered.filter(item => {
      // Filtre par prix
      const itemPrice = item.price || item.pricePerNight || 0;
      if (itemPrice < filters.priceMin || itemPrice > filters.priceMax) return false;
      
      // Filtre par note
      const itemRating = item.rating || 0;
      if (itemRating < filters.rating) return false;
      
      // Filtre par escales (vols uniquement)
      if (filters.stops !== 'all' && searchType === 'flights') {
        if (filters.stops === 'direct' && item.stops > 0) return false;
        if (filters.stops === '1stop' && item.stops !== 1) return false;
      }
      
      return true;
    });

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
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'duration':
        if (searchType === 'flights') {
          filtered.sort((a, b) => (a.duration || 0) - (b.duration || 0));
        }
        break;
      default:
        // recommended - ordre par défaut
        break;
    }

    console.log('📊 Résultats filtrés:', filtered.length, 'sur', results.length);
    setFilteredResults(filtered);
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