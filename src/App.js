import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import TermsConditions from './pages/TermsConditions';
import Profile from './pages/Profile';
import BookingHistory from './pages/BookingHistory';
import Preferences from './pages/Preferences';
import Cart from './pages/Cart';
import OrderSummary from './pages/OrderSummary';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/booking-history" element={<BookingHistory />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-summary" element={<OrderSummary />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;