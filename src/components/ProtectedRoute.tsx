import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-gold">Loading...</div>;

  if (!user) {
    return <Navigate to="/admin" />;
  }

  return <>{children}</>;
};
