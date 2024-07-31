import React, { createContext, useContext, useState, useEffect } from 'react';
import { pb } from '../services/pocketbaseClient'; // Import PocketBase client

// Create a new context for authentication
const AuthContext = createContext();

/**
 * AuthProvider Component
 * 
 * This component provides authentication context to its children. It manages
 * the authentication session using PocketBase and updates the session state
 * accordingly.
 * 
 * @param {Object} children - The child components that need access to the auth context.
 * 
 * @returns {JSX.Element} The provider component with the authentication context.
 */
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null); // State to hold the current session

  useEffect(() => {
    /**
     * getSession Function
     * 
     * Retrieves the current session from PocketBase and sets it in the state.
     */
    const getSession = () => {
      setSession(pb.authStore.model);
    };

    getSession(); // Initialize session state on component mount

    /**
     * handleAuthChange Function
     * 
     * Event handler for changes in authentication state. Updates the session state
     * when the authentication state changes.
     */
    const handleAuthChange = () => {
      setSession(pb.authStore.model);
    };

    // Subscribe to changes in the auth state
    pb.authStore.onChange(handleAuthChange);

    // Cleanup function to unsubscribe from the auth changes when the component unmounts
    return () => {
      pb.authStore.onChange(null);
    };
  }, []);

  /**
   * getToken Function
   * 
   * Retrieves the current authentication token.
   * 
   * @returns {Promise<string|null>} The authentication token or null if not available.
   */
  const getToken = async () => {
    return pb.authStore.token || null;
  };

  return (
    <AuthContext.Provider value={{ session, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 * 
 * Custom hook to use the AuthContext. Provides access to the authentication context
 * which includes the session and getToken function.
 * 
 * @returns {Object} The authentication context value.
 */
export const useAuth = () => useContext(AuthContext);
