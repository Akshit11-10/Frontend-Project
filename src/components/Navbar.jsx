import { useState } from 'react';
import { Menu, X, Brain } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/interview', label: 'Interview' },
    { path: '/results', label: 'Results' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#111827]/90 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg group-hover:scale-110 group-hover:shadow-blue-500/40 transition-all duration-300">
              <Brain className="h-6 w-6 text-white group-hover:animate-pulse" />
            </div>
            <span className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">AceRound</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive(link.path) ? 'bg-blue-600/20 text-blue-300' : 'text-slate-300 hover:text-white'}`}>
                <span className="relative z-10">{link.label}</span>
                {!isActive(link.path) && (
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                {!isActive(link.path) && (
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:left-0 group-hover:w-full" />
                )}
              </Link>
            ))}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300">
            {isOpen ? <X className="h-6 w-6 hover:rotate-90 transition-transform duration-300" /> : <Menu className="h-6 w-6 hover:scale-110 transition-transform duration-300" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#111827]/95 backdrop-blur-md border-t border-slate-700/50 animate-scaleIn">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:translate-x-1 ${isActive(link.path) ? 'bg-blue-600/20 text-blue-300' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'}`}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;