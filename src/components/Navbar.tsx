import React from 'react';
import { motion } from 'motion/react';
import { Scissors } from 'lucide-react';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-gradient-to-b from-ink to-transparent"
    >
      <div className="flex items-center gap-2">
        <Scissors className="w-6 h-6 text-gold" />
        <span className="text-2xl font-serif tracking-[0.3em] uppercase font-bold">MB</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-[0.2em] font-light">
        <a href="#services" className="hover:text-gold transition-colors">Services</a>
        <a href="#booking" className="hover:text-gold transition-colors">Book Now</a>
      </div>

      <a 
        href="#booking"
        className="px-6 py-2 border border-gold/30 rounded-full text-xs uppercase tracking-widest hover:bg-gold hover:text-ink transition-all duration-500"
      >
        Reservation
      </a>
    </motion.nav>
  );
}
