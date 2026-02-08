import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import PublicHeader from './PublicHeader';
import UserHeader from './UserHeader';
import AdminHeader from './AdminHeader';
import { useLocation } from 'react-router-dom';

function Header() {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation(); // <- OK si Header est sous Router

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setIsAuthenticated(!!currentUser);
    setUserRole(currentUser?.role || null);

    const unsubscribe = authService.onAuthChange(user => {
      setIsAuthenticated(!!user);
      setUserRole(user?.role || null);
    });

    return () => unsubscribe();
  }, []);

  // Ne rendre AdminHeader que si Router est prêt
  if (!isAuthenticated) return <PublicHeader />;
  if (userRole === 'ADMIN') return <AdminHeader />; // ✅ ok si sous Router
  return <UserHeader />;
}

export default Header;
