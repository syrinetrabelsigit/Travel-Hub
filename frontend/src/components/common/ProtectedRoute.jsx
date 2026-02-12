import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion
    const currentPath = window.location.pathname;
    localStorage.setItem('redirectAfterLogin', currentPath);
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;