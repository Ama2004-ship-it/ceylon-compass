import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/places', label: 'Explore Places' },
  { to: '/map', label: 'Map' },
  { to: '/itinerary', label: 'My Itinerary' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { places } = useItinerary();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-full text-sm font-medium transition ${
      isActive ? 'bg-ocean-500 text-white' : 'text-ocean-800 hover:bg-ocean-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-ocean-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/compass-icon.svg" alt="Ceylon Compass" className="w-9 h-9" />
          <span className="font-display font-bold text-lg text-ocean-900">
            Ceylon <span className="text-ocean-500">Compass</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
              {link.label}
              {link.to === '/itinerary' && places.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-[11px] rounded-full bg-sand-400 text-ocean-950 font-bold">
                  {places.length}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/admin/dashboard" className="btn-secondary !px-4 !py-2">
                Admin Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="btn-outline-light !text-ocean-700 !border-ocean-200 !bg-transparent !px-4 !py-2"
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="btn-secondary !px-4 !py-2">
              Admin Login
            </Link>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-ocean-800 hover:bg-ocean-50"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-ocean-100 bg-white px-4 py-3 space-y-1 animate-fade-in">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-ocean-500 text-white' : 'text-ocean-800 hover:bg-ocean-50'
                }`
              }
              end={link.to === '/'}
            >
              {link.label} {link.to === '/itinerary' && places.length > 0 && `(${places.length})`}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/admin/dashboard" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm font-medium text-ocean-800">
                Admin Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                  navigate('/');
                }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-ocean-800"
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/admin/login" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm font-medium text-ocean-800">
              Admin Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
