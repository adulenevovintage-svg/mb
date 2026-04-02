import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import BookingForm from './components/BookingForm';
import ManageBooking from './components/ManageBooking';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';
import { SEO } from './components/SEO';

function HomePage() {
  return (
    <div className="min-h-screen bg-ink selection:bg-gold selection:text-ink">
      <SEO />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <BookingForm />
        <ManageBooking />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
