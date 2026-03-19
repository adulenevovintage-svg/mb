import React from 'react';
import { motion } from 'motion/react';
import { Scissors, Zap, Wind, Star } from 'lucide-react';

const services = [
  {
    title: "CLASSIC HAIRCUT",
    price: "500 Birr",
    duration: "45 MIN",
    description: "Precision haircut tailored to your head shape and hair type. Includes hot towel finish.",
    icon: Scissors
  },
  {
    title: "CLASSIC HAIRCUT + WASH",
    price: "600 Birr",
    duration: "45 MIN",
    description: "Our signature precision cut followed by a refreshing deep-cleansing wash and scalp massage.",
    icon: Wind
  },
  {
    title: "FULL RITUAL (VIP)",
    price: "1000 Birr",
    duration: "90 MIN",
    description: "Signature cut, royal shave, and scalp massage. The ultimate grooming experience for the modern gentleman.",
    icon: Zap
  }
];

export default function Services() {
  return (
    <section id="services" className="py-32 px-8 bg-ink relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-24 gap-12 text-center md:text-left">
          <div className="max-w-2xl">
            <h2 className="text-6xl md:text-7xl font-serif mb-8">Our Craft</h2>
            <p className="text-paper/50 font-light leading-relaxed text-lg">
              We don't just cut hair; we curate an identity. Each service is a ritual 
              designed to elevate your presence and restore your confidence.
            </p>
          </div>
          <div className="hidden md:block">
            <span className="text-gold font-serif italic text-3xl opacity-80">Excellence in every stroke</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-px bg-white/5 border border-white/5">
          {services.slice(0, 2).map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-ink p-12 hover:bg-white/[0.03] transition-all duration-500 group cursor-default relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/[0.02] transition-colors duration-500" />
              <div className="relative z-10">
                <service.icon className="w-10 h-10 text-gold mb-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-3xl font-serif group-hover:text-gold transition-colors duration-300">{service.title}</h3>
                  <span className="text-gold font-mono text-lg font-bold">{service.price}</span>
                </div>
                <span className="text-[12px] text-paper/30 uppercase tracking-[0.3em] block mb-8">
                  Duration: {service.duration}
                </span>
                <p className="text-paper/50 text-base font-light leading-relaxed group-hover:text-paper/70 transition-colors duration-300">
                  {service.description}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gold group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
        
        {/* FULL RITUAL (VIP) - Centered and Bigger */}
        <div className="mt-px bg-white/5 border-x border-b border-white/5">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-ink p-16 md:p-24 hover:bg-white/[0.03] transition-all duration-500 group cursor-default relative overflow-hidden text-center flex flex-col items-center"
          >
            <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/[0.04] transition-colors duration-500" />
            <div className="relative z-10 max-w-3xl">
              <Zap className="w-16 h-16 text-gold mb-12 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 mx-auto" />
              <div className="flex flex-col items-center mb-8">
                <h3 className="text-5xl md:text-6xl font-serif group-hover:text-gold transition-colors duration-300 mb-4">FULL RITUAL (VIP)</h3>
                <span className="text-gold font-mono text-3xl font-bold">1000 Birr</span>
              </div>
              <span className="text-[14px] text-paper/30 uppercase tracking-[0.4em] block mb-10">
                Duration: 90 MIN
              </span>
              <p className="text-paper/50 text-xl font-light leading-relaxed group-hover:text-paper/70 transition-colors duration-300">
                Signature cut, royal shave, and scalp massage. The ultimate grooming experience for the modern gentleman who demands nothing but the best.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 w-0 h-2 bg-gold group-hover:w-full transition-all duration-700" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
