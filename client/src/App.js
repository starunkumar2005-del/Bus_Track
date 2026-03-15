/**
 * Main App Component
 */
import React, { useState } from 'react';
import BusMap from './components/BusMap';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('tracker');

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🚌 Bus Tracking System</h1>
          <nav className="nav-menu">
            <button
              className={`nav-btn ${currentPage === 'tracker' ? 'active' : ''}`}
              onClick={() => setCurrentPage('tracker')}
            >
              Live Tracker
            </button>
            <button
              className={`nav-btn ${currentPage === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentPage('admin')}
            >
              Admin Dashboard
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {currentPage === 'tracker' && <BusMap />}
        {currentPage === 'admin' && <AdminDashboard />}
      </main>

      <footer className="app-footer">
        <p>Bus Tracking System v1.0 | Real-time Bus Simulation</p>
      </footer>
    </div>
  );
}

export default App;
