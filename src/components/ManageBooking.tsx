import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Calendar, Clock, Scissors, AlertTriangle } from 'lucide-react';
import { firebaseService } from '../services/firebaseService';
import { useBookings } from '../hooks/useBookings';
import { Reservation } from '../types';

export default function ManageBooking() {
  const [phone, setPhone] = useState('+251 ');
  const [searchResult, setSearchResult] = useState<Reservation[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const { bookings } = useBookings();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.startsWith('+251 ')) {
      const suffix = value.slice(5);
      if (/^\d*$/.test(suffix)) {
        setPhone(value);
      }
    } else if (value.length < 5) {
      setPhone('+251 ');
    }
  };

  const handleSearch = () => {
    setIsLoading(true);
    // Find all bookings for this phone number
    const found = bookings.filter(b => b.phone.trim() === phone.trim() && b.status !== 'cancelled');
    setSearchResult(found);
    setIsLoading(false);
  };

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await firebaseService.cancelBooking(id);
      // Update local state
      setSearchResult(prev => prev ? prev.filter(b => b.id !== id) : null);
      setShowConfirm(null);
    } catch (err) {
      console.error("Cancel Error:", err);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <section id="manage" className="py-20 px-8 bg-black/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-gold mb-4">Manage Your Booking</h2>
          <p className="text-paper/50 font-light">Enter your phone number to find and manage your reservations.</p>
        </div>

        <div className="glass-card p-8 rounded-3xl max-w-xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50 group-focus-within:text-gold transition-colors" />
              <input 
                type="tel" 
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+251 911 000 000"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-5 focus:border-gold/50 focus:bg-white/[0.08] outline-none transition-all text-base"
              />
            </div>
            <button 
              onClick={handleSearch}
              disabled={isLoading || phone.length < 10}
              className="gold-gradient px-8 py-4 rounded-2xl text-ink font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              Find
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchResult && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {searchResult.length === 0 ? (
                <p className="text-center text-paper/40 italic">No active reservations found for this number.</p>
              ) : (
                searchResult.map((booking) => (
                  <div key={booking.id} className="glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-white/5 hover:border-gold/20 transition-all">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gold/50" />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-paper/30">Date</p>
                          <p className="text-sm font-medium">{booking.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gold/50" />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-paper/30">Time</p>
                          <p className="text-sm font-medium">{booking.bookingTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Scissors className="w-5 h-5 text-gold/50" />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-paper/30">Service</p>
                          <p className="text-sm font-medium">{booking.service}</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-auto">
                      {showConfirm === booking.id ? (
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleCancel(booking.id!)}
                            disabled={cancellingId === booking.id}
                            className="bg-red-500/20 text-red-500 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-500/30 transition-all"
                          >
                            {cancellingId === booking.id ? "Cancelling..." : "Confirm"}
                          </button>
                          <button 
                            onClick={() => setShowConfirm(null)}
                            className="text-paper/40 hover:text-paper transition-all"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setShowConfirm(booking.id!)}
                          className="text-red-500/50 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition-all"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
