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

  const handleAmenityChange = (e) => {
    const amenity = e.target.value;
    const isChecked = e.target.checked;
    
    let newAmenities = [...(filters.amenities || [])];
    
    if (isChecked) {
      newAmenities.push(amenity);
    } else {
      newAmenities = newAmenities.filter(a => a !== amenity);
    }
    
    onFilterChange({ amenities: newAmenities });
  };

  const handleCategoryChange = (e) => {
    onFilterChange({ category: e.target.value });
  };

  const handleReset = () => {
    onFilterChange({
      priceMin: 0,
      priceMax: 10000,
      rating: 0,
      stops: 'all',
      airlines: [],
      amenities: [],
      category: 'all'
    });
  };

  return (
    <div className="fp-panel">
      <div className="fp-header">
        <h3 className="fp-title">Filtres</h3>
        <button onClick={handleReset} className="fp-reset-btn">Réinitialiser</button>
      </div>
      
      {/* Filtre Prix */}
      <div className="fp-section">
        <h4 className="fp-section-title">Prix (DT)</h4>
        <div className="fp-price-inputs">
          <input
            type="number"
            name="priceMin"
            value={filters.priceMin}
            onChange={handlePriceChange}
            placeholder="Min"
            className="fp-price-input"
          />
          <span className="fp-price-separator">-</span>
          <input
            type="number"
            name="priceMax"
            value={filters.priceMax}
            onChange={handlePriceChange}
            placeholder="Max"
            className="fp-price-input"
          />
        </div>
        <div className="fp-price-range">
          <input
            type="range"
            name="priceMax"
            min="0"
            max="10000"
            step="100"
            value={filters.priceMax}
            onChange={handlePriceChange}
            className="fp-price-slider"
          />
          <div className="fp-price-labels">
            <span>0 DT</span>
            <span>10 000 DT</span>
          </div>
        </div>
      </div>

      {/* Filtre Note */}
      <div className="fp-section">
        <h4 className="fp-section-title">Note minimum</h4>
        <select
          value={filters.rating}
          onChange={handleRatingChange}
          className="fp-select"
        >
          <option value="0">Toutes les notes</option>
          <option value="3">3+ ⭐</option>
          <option value="3.5">3.5+ ⭐</option>
          <option value="4">4+ ⭐</option>
          <option value="4.5">4.5+ ⭐</option>
        </select>
      </div>

      {/* Filtre Escales - CORRIGÉ */}
      {searchType === 'flights' && (
        <div className="fp-section">
          <h4 className="fp-section-title">Escales</h4>
          <div className="fp-options">
            <label className="fp-option">
              <input
                type="radio"
                name="stops"
                value="all"
                checked={filters.stops === 'all'}
                onChange={handleStopsChange}
              />
              <span>Toutes</span>
            </label>
            <label className="fp-option">
              <input
                type="radio"
                name="stops"
                value="direct"
                checked={filters.stops === 'direct'}
                onChange={handleStopsChange}
              />
              <span>Direct uniquement</span>
            </label>
            <label className="fp-option">
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

      {/* Filtre Équipements */}
      {searchType === 'hotels' && (
        <div className="fp-section">
          <h4 className="fp-section-title">Équipements</h4>
          <div className="fp-options">
            <label className="fp-checkbox">
              <input 
                type="checkbox" 
                value="wifi"
                checked={filters.amenities?.includes('wifi')}
                onChange={handleAmenityChange}
              />
              <span>WiFi gratuit</span>
            </label>
            <label className="fp-checkbox">
              <input 
                type="checkbox" 
                value="pool"
                checked={filters.amenities?.includes('pool')}
                onChange={handleAmenityChange}
              />
              <span>Piscine</span>
            </label>
            <label className="fp-checkbox">
              <input 
                type="checkbox" 
                value="parking"
                checked={filters.amenities?.includes('parking')}
                onChange={handleAmenityChange}
              />
              <span>Parking</span>
            </label>
            <label className="fp-checkbox">
              <input 
                type="checkbox" 
                value="ac"
                checked={filters.amenities?.includes('ac')}
                onChange={handleAmenityChange}
              />
              <span>Climatisation</span>
            </label>
            <label className="fp-checkbox">
              <input 
                type="checkbox" 
                value="restaurant"
                checked={filters.amenities?.includes('restaurant')}
                onChange={handleAmenityChange}
              />
              <span>Restaurant</span>
            </label>
          </div>
        </div>
      )}

      {/* Filtre Catégorie */}
      {searchType === 'activities' && (
        <div className="fp-section">
          <h4 className="fp-section-title">Catégorie</h4>
          <select 
            className="fp-select"
            value={filters.category || 'all'}
            onChange={handleCategoryChange}
          >
            <option value="all">Toutes les catégories</option>
            <option value="culture">Culture & Patrimoine</option>
            <option value="adventure">Aventure</option>
            <option value="food">Gastronomie</option>
            <option value="nature">Nature</option>
            <option value="entertainment">Divertissement</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default FilterPanel;