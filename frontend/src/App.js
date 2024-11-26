// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import DocumentLibrary from './pages/DocumentLibrary';
import SavedItems from './pages/SavedItems';
import Notifications from './pages/Notifications';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-system bg-cyber-black text-cyber-text">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/document-library" element={<DocumentLibrary />} />
            <Route path="/saved-items" element={<SavedItems />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

