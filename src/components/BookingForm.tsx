import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Phone, Mail, ChevronRight, Star } from 'lucide-react';
import { saveReservation } from '../firebase';

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+251 ',
    service: '',
    date: '',
    time: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.startsWith('+251 ')) {
      const suffix = value.slice(5);
      if (/^\d*$/.test(suffix)) {
        setFormData({ ...formData, phone: value });
      }
    } else if (value.length < 5) {
      setFormData({ ...formData, phone: '+251 ' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Store in Firestore
      await saveReservation(formData);
      
      // 2. Trigger Notifications via Backend
      const response = await fetch('/api/notify-barber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (!response.ok || result.warning) {
        console.warn("Notification issue:", result.warning || "API failed");
        // We don't block the user if the notification fails, as long as Firestore worked
      }

      setIsLoading(false);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Booking Error:", err);
      
      let errorMessage = "Failed to save reservation. Please try again.";
      
      // Check if it's our JSON error from Firestore
      try {
        const parsedError = JSON.parse(err.message);
        if (parsedError.error) {
          errorMessage = `Database Error: ${parsedError.error}`;
          if (parsedError.error.includes('permission')) {
            errorMessage += " (Check Firestore Security Rules)";
          }
        }
      } catch (e) {
        // Not a JSON error, use default
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="booking" className="py-32 px-8 bg-[#0F0F0F]">
        <div className="max-w-6xl mx-auto flex justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-16 rounded-3xl text-center max-w-lg"
          >
            <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center text-gold mx-auto mb-8">
              <Star className="w-10 h-10 fill-gold" />
            </div>
            <h2 className="text-4xl font-serif mb-4">Reservation Confirmed</h2>
            <p className="text-paper/60 font-light mb-8">
              Thank you, {formData.name}. Your throne is waiting.
            </p>

            <div className="flex flex-col gap-4 mb-8">
              <a 
                href={`https://t.me/am_e3f?text=${encodeURIComponent(
                  `💈 NEW RESERVATION 💈\n\n👤 Customer: ${formData.name}\n📞 Phone: ${formData.phone}\n📧 Email: ${formData.email}\n✂️ Service: ${formData.service}\n📅 Date: ${new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n⏰ Time: ${formData.time}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-[#229ED9] text-white font-bold uppercase tracking-widest rounded-xl hover:bg-[#1c86b9] transition-all flex items-center justify-center gap-3"
              >
                Send to Barber via Telegram
              </a>
              
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-gold uppercase tracking-widest text-xs hover:underline"
              >
                Make another reservation
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-32 px-8 bg-[#0F0F0F]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="text-center lg:text-left">
          <h2 className="text-6xl md:text-7xl font-serif mb-10 leading-tight">Reserve Your <br /><span className="italic text-gold">Throne</span></h2>
          <p className="text-paper/50 font-light mb-12 leading-relaxed max-w-md mx-auto lg:mx-0 text-lg">
            Our master barbers are in high demand. Secure your preferred time slot 
            and receive instant confirmation via SMS and Email.
          </p>
          
          <div className="space-y-8 max-w-xs mx-auto lg:mx-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center text-gold">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-widest font-medium">Email Confirmation</h4>
                <p className="text-xs text-paper/40">Detailed itinerary sent to your inbox</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center text-gold">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-widest font-medium">SMS Reminders</h4>
                <p className="text-xs text-paper/40">Real-time updates to your mobile device</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -10 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-12 rounded-[2rem] shadow-2xl shadow-gold/5 border border-white/10 hover:border-gold/30 transition-all duration-500"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] uppercase tracking-[0.2em] text-paper/40 ml-1 font-medium">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50 group-focus-within:text-gold transition-colors" />
                  <input 
                    type="text" 
                    required
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 focus:border-gold/50 focus:bg-white/[0.08] outline-none transition-all text-base"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] uppercase tracking-[0.2em] text-paper/40 ml-1 font-medium">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50 group-focus-within:text-gold transition-colors" />
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    placeholder="+251 911 000 000"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 focus:border-gold/50 focus:bg-white/[0.08] outline-none transition-all text-base"
                    onChange={handlePhoneChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] uppercase tracking-[0.2em] text-paper/40 ml-1 font-medium">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50 group-focus-within:text-gold transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 focus:border-gold/50 focus:bg-white/[0.08] outline-none transition-all text-base"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] uppercase tracking-[0.2em] text-paper/40 ml-1 font-medium">Select Service</label>
              <div className="relative group">
                <Star className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50 group-focus-within:text-gold transition-colors" />
                <select 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 focus:border-gold/50 focus:bg-white/[0.08] outline-none transition-all text-base appearance-none cursor-pointer"
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                >
                  <option value="" className="bg-ink">Select Service</option>
                  <option value="Classic Haircut" className="bg-ink">Classic Haircut</option>
                  <option value="Beard Grooming" className="bg-ink">Beard Grooming</option>
                  <option value="Royal Shave" className="bg-ink">Royal Shave</option>
                  <option value="Hair Styling" className="bg-ink">Hair Styling</option>
                  <option value="Full Service" className="bg-ink">Full Service (Hair + Beard)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] uppercase tracking-[0.2em] text-paper/40 ml-1 font-medium">Date</label>
                <div className="relative group">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50 group-focus-within:text-gold transition-colors" />
                  <input 
                    type="date" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 focus:border-gold/50 focus:bg-white/[0.08] outline-none transition-all text-base appearance-none"
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] uppercase tracking-[0.2em] text-paper/40 ml-1 font-medium">Time</label>
                <div className="relative group">
                  <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50 group-focus-within:text-gold transition-colors" />
                  <select 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 focus:border-gold/50 focus:bg-white/[0.08] outline-none transition-all text-base appearance-none cursor-pointer"
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  >
                    <option value="" className="bg-ink">Select Time</option>
                    <option value="09:00 AM" className="bg-ink">09:00 AM</option>
                    <option value="10:00 AM" className="bg-ink">10:00 AM</option>
                    <option value="11:00 AM" className="bg-ink">11:00 AM</option>
                    <option value="01:00 PM" className="bg-ink">01:00 PM</option>
                    <option value="02:00 PM" className="bg-ink">02:00 PM</option>
                    <option value="03:00 PM" className="bg-ink">03:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-6 bg-gold text-ink font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-gold-light hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-gold/10"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
              ) : (
                <>
                  Confirm Reservation
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {error && (
              <p className="text-red-500 text-xs text-center mt-4 font-medium uppercase tracking-widest">
                {error}
              </p>
            )}
            
            <p className="text-[10px] text-center text-paper/30 uppercase tracking-widest">
              By booking, you agree to our terms of service and privacy policy.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
