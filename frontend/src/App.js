import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import SearchPage from './pages/SearchPage';
import ResearchPage from './pages/ResearchPage';
import AIModelsPage from './pages/AIModelsPage';
import LoginPage from './pages/LoginPage';
import MyAccountPage from './pages/MyAccountPage';
import MySettingsPage from './pages/MySettingsPage';
import MyResearchProjectsPage from './pages/MyResearchProjectsPage';
import MyModelsPage from './pages/MyModelsPage';
import { supabase } from './supabaseClient';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setAuthenticated(!!session);
      setLoading(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while checking authentication
  }

  return (
    <Router>
      {authenticated && <NavBar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={authenticated ? <SearchPage /> : <Navigate to="/login" />} />
        <Route path="/research/:projectId" element={authenticated ? <ResearchPage /> : <Navigate to="/login" />} />
        <Route path="/ai-models" element={authenticated ? <AIModelsPage /> : <Navigate to="/login" />} />
        <Route path="/account" element={authenticated ? <MyAccountPage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={authenticated ? <MySettingsPage /> : <Navigate to="/login" />} />
        <Route path="/research-projects" element={authenticated ? <MyResearchProjectsPage /> : <Navigate to="/login" />} />
        <Route path="/models" element={authenticated ? <MyModelsPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={authenticated ? "/search" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
