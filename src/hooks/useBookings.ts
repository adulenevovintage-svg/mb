import { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebaseService';

export function useBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = firebaseService.listenToBookings(
      (data) => {
        setBookings(data);
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { bookings, isLoading, error };
}
