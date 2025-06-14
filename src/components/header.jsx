import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Home, Sun, Moon, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark'; // Default to light mode unless explicitly set to dark
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/contact', label: 'Contact' },
    { path: '/about', label: 'About' },
    { path: '/support', label: 'Support' },
    { path: '/policy', label: 'Policy' },
  ];

  const menuVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    closed: { opacity: 0, y: -10, transition: { duration: 0.3 } },
  };

  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-gray-700 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 dark:text-blue-400">
          <Download className="w-6 h-6" />
          TeraBox Downloader
        </Link>

        <div className="flex items-center gap-6">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          <div className="relative hidden sm:block">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-gray-600 dark:text-gray-400"
              aria-label={isDropdownOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="w-5 h-5 flex flex-col justify-center gap-1">
                <span className="h-0.5 w-full bg-gray-600 dark:bg-gray-400 rounded"></span>
                <span className="h-0.5 w-full bg-gray-600 dark:bg-gray-400 rounded"></span>
                <span className="h-0.5 w-full bg-gray-600 dark:bg-gray-400 rounded"></span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={menuVariants}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2"
                >
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-blue-500 dark:hover:text-blue-400 transition"
                    >
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={toggleMenu}
            className="sm:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
              <span
                className={`h-0.5 w-full bg-gray-600 dark:bg-gray-400 rounded transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              ></span>
              <span
                className={`h-0.5 w-full bg-gray-600 dark:bg-gray-400 rounded transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                className={`h-0.5 w-full bg-gray-600 dark:bg-gray-400 rounded transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="sm:hidden bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-gray-700 mt-2"
          >
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={toggleMenu}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition flex items-center gap-2"
                >
                  {item.label === 'Home' && <Home className="w-4 h-4" />}
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;