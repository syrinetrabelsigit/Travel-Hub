import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;