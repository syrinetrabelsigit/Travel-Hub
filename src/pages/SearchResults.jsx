import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import './SearchResults.css';
import ResultCard from '../components/search/ResultCard';
import FilterPanel from '../components/search/FilterPanel';

function SearchResults() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recommended');
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 10000,
    rating: 0,
    stops: 'all',
    airlines: [],
    amenities: []
  });

  const searchType = location.pathname.split('/')[2]; // flights, hotels, ou activities

  useEffect(() => {
    fetchResults();
  }, [searchParams]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [results, filters, sortBy]);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      const query = Object.fromEntries(searchParams);
      const response = await fetch(
        `http://localhost:8080/api/search/${searchType}?${new URLSearchParams(query)}`
      );
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Erreur:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...results];

    // Application des filtres
    filtered = filtered.filter(item => {
      if (item.price < filters.priceMin || item.price > filters.priceMax) return false;
      if (item.rating < filters.rating) return false;
      if (filters.stops !== 'all' && searchType === 'flights') {
        if (filters.stops === 'direct' && item.stops > 0) return false;
        if (filters.stops === '1stop' && item.stops !== 1) return false;
      }
      return true;
    });

    // Application du tri
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        if (searchType === 'flights') {
          filtered.sort((a, b) => a.duration - b.duration);
        }
        break;
      default:
        // recommended - ordre par défaut de l'API
        break;
    }

    setFilteredResults(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
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
        <div className="results-header">
          <h1 className="results-title">
            {filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''} trouvé{filteredResults.length > 1 ? 's' : ''}
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
                <p>Essayez d'ajuster vos filtres ou vos critères de recherche</p>
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