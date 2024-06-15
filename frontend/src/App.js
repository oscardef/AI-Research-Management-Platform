// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from './components/NavBar';
import SearchPage from './pages/SearchPage';
import ResearchPage from './pages/ResearchPage';
import ModelsPage from './pages/AIModelsPage';
import HomePage from './pages/HomePage';
import AccountPage from './pages/AccountPage';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/ai-models" element={<ModelsPage />} />
          <Route path="/my-account" element={<AccountPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
