import React from 'react';
import { useBookings } from '../hooks/useBookings';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, Calendar, User, Phone, Scissors } from 'lucide-react';
import { auth } from '../firebase';
import { firebaseService } from '../services/firebaseService';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export default function AdminDashboard() {
  const { bookings, isLoading } = useBookings();
  const { user, loading: authLoading } = useAuth();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-gold">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-serif text-gold mb-6">Barber Admin</h1>
          <button 
            onClick={handleLogin}
            className="gold-gradient w-full py-3 rounded-lg text-black font-bold flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-serif text-gold">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage your reservations and schedule</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 border border-gold/30 text-gold rounded-full hover:bg-gold/10 transition-colors flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <div className="text-center py-20 text-gold/50">Loading reservations...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 text-gray-500 glass-card">No reservations found</div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Client</p>
                      <p className="text-white font-medium">{booking.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                      <p className="text-white font-medium">{booking.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Date & Time</p>
                      <p className="text-white font-medium">{booking.date} at {booking.bookingTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                      <Scissors size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Service</p>
                      <p className="text-white font-medium">{booking.service}</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/5 flex items-center gap-4">
                  {booking.status === 'cancelled' ? (
                    <span className="px-4 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest">
                      Cancelled
                    </span>
                  ) : (
                    <>
                      <span className="px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                        Confirmed
                      </span>
                      <button 
                        onClick={() => firebaseService.cancelBooking(booking.id!)}
                        className="text-red-500/50 hover:text-red-500 text-[10px] uppercase tracking-widest font-bold transition-all"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
