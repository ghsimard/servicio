import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeLogging, trackAction } from '../utils/logging';
import { useAuth } from './AuthContext';

interface LoggingContextType {
  trackUserAction: (pageVisited: string, actionType: string, actionData?: Record<string, unknown>) => Promise<void>;
  isInitialized: boolean;
}

const LoggingContext = createContext<LoggingContextType | undefined>(undefined);

export function LoggingProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const initialize = async () => {
      if (isAuthenticated && user?.user_id) {
        try {
          const sessionId = await initializeLogging(user.user_id);
          if (sessionId) {
            setIsInitialized(true);
          }
        } catch (error) {
          console.error('Failed to initialize logging:', error);
        }
      }
    };

    if (isAuthenticated && user && !isInitialized) {
      initialize();
    }

    return () => {
      // Cleanup will be handled by beforeunload event in the logging utility
    };
  }, [isAuthenticated, user, isInitialized]);

  const trackUserAction = async (
    pageVisited: string,
    actionType: string,
    actionData?: Record<string, unknown>
  ) => {
    if (!isAuthenticated || !user?.user_id) {
      // Don't track for unauthenticated users
      return;
    }

    try {
      await trackAction(user.user_id, pageVisited, actionType, actionData);
    } catch (error) {
      console.error('Failed to track action:', error);
    }
  };

  return (
    <LoggingContext.Provider
      value={{
        trackUserAction,
        isInitialized,
      }}
    >
      {children}
    </LoggingContext.Provider>
  );
}

export function useLogging() {
  const context = useContext(LoggingContext);
  if (context === undefined) {
    throw new Error('useLogging must be used within a LoggingProvider');
  }
  return context;
} 