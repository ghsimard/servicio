import React, { createContext, useContext, useState, useCallback } from 'react';

interface AccessibilityContextType {
  announceMessage: (message: string) => void;
  lastAnnouncement: string;
  setFocusTarget: (id: string) => void;
  focusTarget: string | null;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [lastAnnouncement, setLastAnnouncement] = useState('');
  const [focusTarget, setFocusTarget] = useState<string | null>(null);

  const announceMessage = useCallback((message: string) => {
    setLastAnnouncement(message);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        announceMessage,
        lastAnnouncement,
        setFocusTarget,
        focusTarget,
      }}
    >
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: '0' }}
      >
        {lastAnnouncement}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
} 