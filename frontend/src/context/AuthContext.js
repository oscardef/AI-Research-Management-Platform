import React, { createContext, useContext, useState, useEffect } from 'react';
import { pb } from '../services/pocketbaseClient'; // Adjusted import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = () => {
      setSession(pb.authStore.model);
    };

    getSession();

    const handleAuthChange = () => {
      setSession(pb.authStore.model);
    };

    pb.authStore.onChange(handleAuthChange);

    return () => {
      // Clean up effect
      pb.authStore.onChange(null);
    };
  }, []);

  const getToken = async () => {
    return pb.authStore.token || null;
  };

  return (
    <AuthContext.Provider value={{ session, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
