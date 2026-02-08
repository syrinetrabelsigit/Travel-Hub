import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner({ text = 'Chargement...' }) {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">{text}</p>
    </div>
  );
}

export default LoadingSpinner;