import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiHome, FiPlus, FiLogOut, FiLogIn, FiUser, FiMenu, FiX, FiSettings } from 'react-icons/fi';
import { useState } from 'react';

export const Header = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            H
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            HBnB
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="flex items-center gap-1 text-gray-700 hover:text-purple-600 font-medium">
            <FiHome /> Browse
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/my-places"
                className="flex items-center gap-1 text-gray-700 hover:text-purple-600 font-medium"
              >
                📍 My Places
              </Link>
              <Link
                to="/create-place"
                className="flex items-center gap-1 text-gray-700 hover:text-purple-600 font-medium"
              >
                <FiPlus /> List Place
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/amenities"
                  className="flex items-center gap-1 text-gray-700 hover:text-purple-600 font-medium"
                  title="Admin Panel"
                >
                  <FiSettings />
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 text-gray-700 hover:text-purple-600 font-medium"
              >
                <FiLogIn /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium"
              >
                <FiUser /> Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 hover:text-purple-600"
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4 px-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block flex items-center gap-2 text-gray-700 hover:text-purple-600 py-2 font-medium"
          >
            <FiHome /> Browse
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/my-places"
                onClick={() => setMenuOpen(false)}
                className="block flex items-center gap-2 text-gray-700 hover:text-purple-600 py-2 font-medium"
              >
                📍 My Places
              </Link>
              <Link
                to="/create-place"
                onClick={() => setMenuOpen(false)}
                className="block flex items-center gap-2 text-gray-700 hover:text-purple-600 py-2 font-medium"
              >
                <FiPlus /> List Place
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/amenities"
                  onClick={() => setMenuOpen(false)}
                  className="block flex items-center gap-2 text-gray-700 hover:text-purple-600 py-2 font-medium"
                >
                  <FiSettings /> Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block flex items-center gap-2 text-gray-700 hover:text-purple-600 py-2 font-medium"
              >
                <FiLogIn /> Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium"
              >
                <FiUser /> Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded flex items-center justify-center text-white text-sm font-bold">
                H
              </div>
              HBnB
            </h4>
            <p className="text-sm">Discover amazing places to stay around the world.</p>
          </div>

          <div>
            <h5 className="font-bold text-white mb-4">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-purple-400">
                  Browse Places
                </a>
              </li>
              <li>
                <a href="/create-place" className="hover:text-purple-400">
                  List Your Place
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-4">Support</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-purple-400">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-4">Legal</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-purple-400">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; 2024 HBnB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
