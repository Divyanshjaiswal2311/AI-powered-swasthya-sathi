import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * Theme Context for managing global light/dark mode
 */
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Get theme preference from localStorage on initial load
    const saved = localStorage.getItem('appThemeDarkMode');
    return saved !== null ? JSON.parse(saved) : false; // Default to light mode
  });

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appThemeDarkMode', JSON.stringify(isDarkMode));
    // Apply theme to document root for CSS variables
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;

