import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import SearchPage from './pages/SearchPage';
import ResearchPage from './pages/ResearchPage';
import AIModelsPage from './pages/AIModelsPage';
import SettingsPage from './pages/SettingsPage';
import MyResearchProjectsPage from './pages/MyResearchProjectsPage';
import MyModelsPage from './pages/MyModelsPage';
import LoginPage from './pages/LoginPage';
import NavBar from './components/NavBar';

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setLoading(false);
      });
    };

    getSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {session && <NavBar session={session} handleLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={session ? <SearchPage /> : <Navigate to="/login" />} />
        <Route path="/research" element={session ? <ResearchPage /> : <Navigate to="/login" />} />
        <Route path="/aimodels" element={session ? <AIModelsPage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={session ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route
          path="/my-research-projects"
          element={session ? <MyResearchProjectsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-models"
          element={session ? <MyModelsPage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={session ? "/search" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
