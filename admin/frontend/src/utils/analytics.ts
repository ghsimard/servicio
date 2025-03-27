import axios from 'axios';

// Define action types constants
export const ACTION_TYPES = {
  PAGE_VIEW: 'page_view',
  BUTTON_CLICK: 'button_click',
  SEARCH: 'search',
  FILTER: 'filter',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  EXPORT: 'export',
  IMPORT: 'import',
  LOGIN: 'login',
  LOGOUT: 'logout',
  ERROR: 'error',
};

// Track user actions
let sessionId: string | null = null;
const APP_SOURCE = 'admin-app';
const ADMIN_API_URL = 'http://localhost:3003';

// Initialize analytics with session creation
export const initializeAnalytics = async (userId: string): Promise<string | null> => {
  if (!userId) {
    console.error('Cannot initialize analytics without user ID');
    return null;
  }

  // Check if we already have a valid session ID in localStorage
  const storedSessionId = localStorage.getItem('analyticsSessionId');
  if (storedSessionId) {
    console.log('Using existing analytics session ID:', storedSessionId);
    sessionId = storedSessionId;
    return storedSessionId;
  }

  // Clear any existing session to force a new one
  sessionId = null;
  localStorage.removeItem('analyticsSessionId');

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token available');
      return null;
    }

    console.log('Creating new analytics session for user:', userId);
    const response = await axios.post(
      `${ADMIN_API_URL}/analytics/session`,
      { source: APP_SOURCE },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (!response.data || !response.data.sessionId) {
      console.error('Failed to get session ID from server response');
      return null;
    }
    
    const newSessionId = response.data.sessionId;
    sessionId = newSessionId;
    
    // Store in localStorage for persistence
    localStorage.setItem('analyticsSessionId', newSessionId);
    
    // Set up listener for page unload
    window.addEventListener('beforeunload', endSession);
    
    console.log('Analytics session initialized:', newSessionId);
    return newSessionId;
  } catch (error) {
    console.error('Failed to initialize analytics session:', error);
    return null;
  }
};

// End analytics session
const endSession = async () => {
  if (sessionId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      await axios.post(
        `${ADMIN_API_URL}/analytics/end-session`,
        { sessionId, source: APP_SOURCE },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
      // Clear the stored session ID
      localStorage.removeItem('analyticsSessionId');
      sessionId = null;
    } catch (error) {
      console.error('Failed to end analytics session:', error);
    }
  }
};

// Track user actions
export const trackUserAction = async (
  pageVisited: string,
  actionType: string,
  actionData: Record<string, any> = {}
): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      console.warn('No authentication token or user ID available');
      return;
    }
    
    // Initialize session if not already done
    let trackingSessionId = sessionId;
    if (!trackingSessionId) {
      console.warn('No active analytics session, initializing...');
      trackingSessionId = await initializeAnalytics(userId);
      if (!trackingSessionId) {
        console.error('Failed to initialize session. Cannot track action.');
        return;
      }
    }

    await axios.post(
      `${ADMIN_API_URL}/analytics/track`,
      {
        sessionId: trackingSessionId,
        pageVisited,
        actionType,
        actionData,
        source: APP_SOURCE
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log(`Tracked action: ${actionType} on page ${pageVisited}`);
  } catch (error) {
    console.error('Failed to track user action:', error);
  }
};

// Helper to track page views
export const trackPageView = (pagePath: string): void => {
  trackUserAction(pagePath, ACTION_TYPES.PAGE_VIEW, {});
};

// Deprecated function signatures - keeping for backward compatibility
export const withTracking = (
  fn: (...args: any[]) => any,
  actionType: string,
  getData?: (...args: any[]) => any
) => {
  return (...args: any[]) => {
    try {
      // Call the original function
      const result = fn(...args);
      
      // Track the action with new signature
      const currentPage = typeof window !== 'undefined' ? window.location.pathname : '';
      trackUserAction(
        currentPage,
        actionType,
        getData ? getData(...args) : { args }
      );
      
      return result;
    } catch (error) {
      // Track the error
      const currentPage = typeof window !== 'undefined' ? window.location.pathname : '';
      trackUserAction(
        currentPage,
        ACTION_TYPES.ERROR,
        {
          errorMessage: error instanceof Error ? error.message : String(error),
          actionType,
        }
      );
      
      // Re-throw to keep original behavior
      throw error;
    }
  };
}; 