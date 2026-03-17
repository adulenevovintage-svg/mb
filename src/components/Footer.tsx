import React from 'react';
import { Scissors, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-20 px-8 bg-ink border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Scissors className="w-6 h-6 text-gold" />
            <span className="text-2xl font-serif tracking-[0.3em] uppercase font-bold">MB</span>
          </div>
          <p className="text-paper/40 font-light max-w-sm mb-8 leading-relaxed">
            Elevating the standard of male grooming. 
            Experience the tradition of excellence in the heart of the city.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest font-medium mb-6">Location</h4>
          <p className="text-paper/40 text-sm font-light leading-loose">
            Addis Ababa<br />
            Bole Bulbula<br />
            Ethiopia
          </p>
          <p className="text-paper/40 text-sm font-light mt-4">
            +251 911 000 000
          </p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest font-medium mb-6">Hours</h4>
          <p className="text-paper/40 text-sm font-light leading-loose">
            Mon - Fri: 9am - 8pm<br />
            Sat: 10am - 6pm<br />
            Sun: Closed
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-paper/20">
          © 2024 MB Grooming. All rights reserved.
        </p>
        <div className="flex gap-12 text-[10px] uppercase tracking-[0.3em] text-paper/20">
          <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
