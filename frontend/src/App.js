import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Composant ProtectedRoute
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages (vos collègues)
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import TermsConditions from './pages/TermsConditions';
import Profile from './pages/Profile';
import BookingHistory from './pages/BookingHistory';
import Preferences from './pages/Preferences';
import Cart from './pages/Cart';
import OrderSummary from './pages/OrderSummary';

// Pages d'authentification (votre travail)
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Pages de recherche (votre travail)
import Search from './pages/Search';
import SearchResults from './pages/SearchResults';

// Pages de détails (votre travail)
import FlightDetails from './pages/FlightDetails';
import HotelDetails from './pages/HotelDetails';
import ActivityDetails from './pages/ActivityDetails';

// Pages de réservation (votre travail)
import BookingForm from './pages/BookingForm';
import BookingConfirmation from './pages/BookingConfirmation';

// Pages d'avis (votre travail)
import Reviews from './pages/Reviews';

// Pages ADMIN
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBookings from './pages/admin/AdminBookings';
import AdminReviews from './pages/admin/AdminReviews';
import ProfileAdmin from './pages/admin/ProfileAdmin';

function App() {
  return (
      <div className="App">
        <Header />
        <main>
          <Routes>
            {/* Routes de votre collègue */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-summary" element={<OrderSummary />} />

            {/* Routes protégées de votre collègue */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/booking-history" 
              element={
                <ProtectedRoute>
                  <BookingHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/preferences" 
              element={
                <ProtectedRoute>
                  <Preferences />
                </ProtectedRoute>
              } 
            />

            {/* VOS ROUTES - Authentification (publiques) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            
            {/* VOS ROUTES - Recherche (publiques) */}
            <Route path="/search" element={<Search />} />
            <Route path="/search/results" element={<SearchResults />} />
            <Route path="/search/:type/results" element={<SearchResults />} />
            
            {/* VOS ROUTES - Détails (publiques) */}
            <Route path="/flights/:id" element={<FlightDetails />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            <Route path="/activities/:id" element={<ActivityDetails />} />
            
            {/* VOS ROUTES - Avis (publiques) */}
            <Route path="/reviews/:type/:id" element={<Reviews />} />
            
            {/* VOS ROUTES - Réservation (protégées) */}
            <Route 
              path="/booking/:type/:id" 
              element={
                <ProtectedRoute>
                  <BookingForm />
                </ProtectedRoute>
              } 
            />

            {/* Routes ADMIN */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/profileAdmin" element={<ProfileAdmin />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route 
              path="/booking/confirmation/:id" 
              element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              } 
            />
            
            {/* Route 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
  );
}

export default App;