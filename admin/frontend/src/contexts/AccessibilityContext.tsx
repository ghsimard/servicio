import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleScreenReader: () => void;
  toggleKeyboardNavigation: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedLargeText = localStorage.getItem('largeText') === 'true';
    const savedScreenReader = localStorage.getItem('screenReader') === 'true';
    const savedKeyboardNavigation = localStorage.getItem('keyboardNavigation') === 'true';

    setHighContrast(savedHighContrast);
    setLargeText(savedLargeText);
    setScreenReader(savedScreenReader);
    setKeyboardNavigation(savedKeyboardNavigation);
  }, []);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('highContrast', String(newValue));
    document.body.classList.toggle('high-contrast', newValue);
  };

  const toggleLargeText = () => {
    const newValue = !largeText;
    setLargeText(newValue);
    localStorage.setItem('largeText', String(newValue));
    document.body.classList.toggle('large-text', newValue);
  };

  const toggleScreenReader = () => {
    const newValue = !screenReader;
    setScreenReader(newValue);
    localStorage.setItem('screenReader', String(newValue));
    document.body.classList.toggle('screen-reader', newValue);
  };

  const toggleKeyboardNavigation = () => {
    const newValue = !keyboardNavigation;
    setKeyboardNavigation(newValue);
    localStorage.setItem('keyboardNavigation', String(newValue));
    document.body.classList.toggle('keyboard-navigation', newValue);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        largeText,
        screenReader,
        keyboardNavigation,
        toggleHighContrast,
        toggleLargeText,
        toggleScreenReader,
        toggleKeyboardNavigation,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}; 