import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the DarkModeContext
const DarkModeContext = createContext();

// Create a custom hook to use the DarkModeContext
export const useDarkMode = () => {
  return useContext(DarkModeContext);
};

// Create a provider component
export const DarkModeProvider = ({ children }) => {
  // Set initial dark mode state based on localStorage or default to false
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedMode = localStorage.getItem('darkMode');
    return storedMode === 'true';
  });

  // Toggle dark mode and store in localStorage
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode);
      return newMode;
    });
  };

  // Effect to apply dark mode class to the body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
