import React from 'react';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=2070" 
          alt="Barber Shop" 
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex justify-center"
        >
          <img 
            src="/logo2.jpg" 
            alt="MB Logo" 
            className="w-48 h-48 md:w-64 md:h-64 object-contain" 
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gold uppercase tracking-[0.4em] text-sm mb-6 block"
        >
          Premium Grooming
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-7xl md:text-9xl font-serif mb-8 leading-tight tracking-tight"
        >
          Mastering the Art of <br />
          <span className="italic text-gold-gradient inline-block">The MB Cut</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-paper/60 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Experience the pinnacle of traditional barbering fused with modern luxury. 
          Your transformation begins with a single reservation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <a 
            href="#booking"
            className="inline-block px-12 py-5 bg-gold text-ink font-medium uppercase tracking-widest rounded-full hover:bg-gold-light transition-all duration-300 shadow-2xl shadow-gold/20"
          >
            Secure Your Session
          </a>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
        <span className="text-[10px] uppercase tracking-[0.5em]">Scroll</span>
        <div className="w-px h-12 bg-gold" />
      </div>
    </section>
  );
}
