import React from 'react';
import './FilterPanel.css';

function FilterPanel({ searchType, filters, onFilterChange }) {
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: parseInt(value) });
  };

  const handleRatingChange = (e) => {
    onFilterChange({ rating: parseFloat(e.target.value) });
  };

  const handleStopsChange = (e) => {
    onFilterChange({ stops: e.target.value });
  };

  const handleReset = () => {
    onFilterChange({
      priceMin: 0,
      priceMax: 10000,
      rating: 0,
      stops: 'all',
      airlines: [],
      amenities: []
    });
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3 className="filter-title">Filtres</h3>
        <button onClick={handleReset} className="reset-btn">Réinitialiser</button>
      </div>
      
      {/* Filtre Prix */}
      <div className="filter-section">
        <h4 className="filter-section-title">Prix (DT)</h4>
        <div className="price-inputs">
          <input
            type="number"
            name="priceMin"
            value={filters.priceMin}
            onChange={handlePriceChange}
            placeholder="Min"
            className="price-input"
          />
          <span className="price-separator">-</span>
          <input
            type="number"
            name="priceMax"
            value={filters.priceMax}
            onChange={handlePriceChange}
            placeholder="Max"
            className="price-input"
          />
        </div>
        <div className="price-range">
          <input
            type="range"
            name="priceMax"
            min="0"
            max="10000"
            step="100"
            value={filters.priceMax}
            onChange={handlePriceChange}
            className="price-slider"
          />
          <div className="price-labels">
            <span>0 DT</span>
            <span>10 000 DT</span>
          </div>
        </div>
      </div>

      {/* Filtre Note */}
      <div className="filter-section">
        <h4 className="filter-section-title">Note minimum</h4>
        <select
          value={filters.rating}
          onChange={handleRatingChange}
          className="filter-select"
        >
          <option value="0">Toutes les notes</option>
          <option value="3">3+ ⭐</option>
          <option value="3.5">3.5+ ⭐</option>
          <option value="4">4+ ⭐</option>
          <option value="4.5">4.5+ ⭐</option>
        </select>
      </div>

      {/* Filtre Escales (seulement pour les vols) */}
      {searchType === 'flights' && (
        <div className="filter-section">
          <h4 className="filter-section-title">Escales</h4>
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="radio"
                name="stops"
                value="all"
                checked={filters.stops === 'all'}
                onChange={handleStopsChange}
              />
              <span>Toutes</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="stops"
                value="direct"
                checked={filters.stops === 'direct'}
                onChange={handleStopsChange}
              />
              <span>Direct uniquement</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="stops"
                value="1stop"
                checked={filters.stops === '1stop'}
                onChange={handleStopsChange}
              />
              <span>1 escale max</span>
            </label>
          </div>
        </div>
      )}

      {/* Filtre Équipements (seulement pour les hôtels) */}
      {searchType === 'hotels' && (
        <div className="filter-section">
          <h4 className="filter-section-title">Équipements</h4>
          <div className="filter-options">
            <label className="filter-checkbox">
              <input type="checkbox" />
              <span>WiFi gratuit</span>
            </label>
            <label className="filter-checkbox">
              <input type="checkbox" />
              <span>Piscine</span>
            </label>
            <label className="filter-checkbox">
              <input type="checkbox" />
              <span>Parking</span>
            </label>
            <label className="filter-checkbox">
              <input type="checkbox" />
              <span>Climatisation</span>
            </label>
            <label className="filter-checkbox">
              <input type="checkbox" />
              <span>Restaurant</span>
            </label>
          </div>
        </div>
      )}

      {/* Filtre Catégorie (seulement pour les activités) */}
      {searchType === 'activities' && (
        <div className="filter-section">
          <h4 className="filter-section-title">Catégorie</h4>
          <select className="filter-select">
            <option value="all">Toutes les catégories</option>
            <option value="culture">Culture & Patrimoine</option>
            <option value="adventure">Aventure</option>
            <option value="food">Gastronomie</option>
            <option value="nature">Nature</option>
            <option value="entertainment">Divertissement</option>
          </select>
        </div>
      )}

      <button onClick={handleReset} className="btn btn-secondary btn-full">
        Réinitialiser tous les filtres
      </button>
    </div>
  );
}

export default FilterPanel;