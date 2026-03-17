import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-ink selection:bg-gold selection:text-ink">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <BookingForm />
      </main>
      <Footer />
    </div>
  );
}
