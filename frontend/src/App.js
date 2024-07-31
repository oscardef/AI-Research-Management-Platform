import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import SearchPage from './pages/SearchPage';
import ResearchPage from './pages/ResearchPage';
import ModelPage from './pages/ModelPage';
import LoginPage from './pages/LoginPage';
import MyAccountPage from './pages/MyAccountPage';
import { pb } from './services/pocketbaseClient';
import { AuthProvider } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import ProfilesPage from './pages/ProfilesPage';
import ModelsPage from './pages/ModelsPage';
import ResearchProjectsPage from './pages/ResearchProjectsPage';

/**
 * The main application component, handling routing and authentication status.
 */
const App = () => {
  const [authenticated, setAuthenticated] = useState(false); // State to track if the user is authenticated
  const [loading, setLoading] = useState(true); // State to track if authentication status is being checked

  useEffect(() => {
    /**
     * Function to check the current authentication status.
     * Sets the authenticated state based on the validity of the auth token.
     */
    const checkAuth = () => {
      setAuthenticated(pb.authStore.isValid);
      setLoading(false); // Authentication check completed, set loading to false
    };

    checkAuth(); // Initial authentication check

    /**
     * Event handler to update the authentication status when it changes.
     */
    const handleAuthChange = () => {
      setAuthenticated(pb.authStore.isValid);
    };

    pb.authStore.onChange(handleAuthChange); // Subscribe to auth changes

    return () => {
      // Cleanup subscription on component unmount
      pb.authStore.onChange(null);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while checking authentication
  }

  return (
    <Router>
      <AuthProvider>
        {authenticated && <NavBar />} {/* Show NavBar only if the user is authenticated */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/search" element={authenticated ? <SearchPage /> : <Navigate to="/login" />} />
          <Route path="/dashboard/:userId" element={authenticated ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/research/:projectId" element={authenticated ? <ResearchPage /> : <Navigate to="/login" />} />
          <Route path="/model/:modelId" element={authenticated ? <ModelPage /> : <Navigate to="/login" />} />
          <Route path="/account" element={authenticated ? <MyAccountPage /> : <Navigate to="/login" />} />
          <Route path="/profiles" element={authenticated ? <ProfilesPage /> : <Navigate to="/login" />} />
          <Route path="/research-projects" element={authenticated ? <ResearchProjectsPage /> : <Navigate to="/login" />} />
          <Route path="/models" element={authenticated ? <ModelsPage /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={authenticated ? "/search" : "/login"} />} /> {/* Redirect to default routes based on authentication */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
