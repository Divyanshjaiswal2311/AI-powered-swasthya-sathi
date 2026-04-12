import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

/**
 * Theme Toggle Button Component
 * Displays a button to switch between light and dark themes
 * Used in Layout/Header
 */
const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <FaSun className="toggle-icon sun-icon" />
      ) : (
        <FaMoon className="toggle-icon moon-icon" />
      )}
    </button>
  );
};

export default ThemeToggle;

