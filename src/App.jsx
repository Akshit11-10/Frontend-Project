import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Results from './pages/Results';

import './index.css';

// Main App component - handles routing and layout
function App() {
  return (
    <Router>

      {/* Background animation circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-breathe" />
        <div
          className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-breathe"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500/3 rounded-full blur-2xl animate-breathe"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Main layout container */}
      <div className="flex flex-col min-h-screen relative z-10">

        <Navbar />

<main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>

        <Footer />

      </div>

    </Router>
  );
}

export default App;