import axios from 'axios';
import { URLS } from '../ports';

// Define interface for analytics events
interface AnalyticsEvent {
  userId: string;
  sessionId: string;
  pageVisited: string;
  actionType: string;
  actionData?: Record<string, unknown>;
  source: string;
}

// Queue for batching analytics events
const analyticsQueue: Array<AnalyticsEvent> = [];

let sessionId: string | null = null;
const APP_SOURCE = 'main-app';

// Initialize session on page load
export const initializeLogging = async (userId: string): Promise<string> => {
  if (!userId) {
    console.error('User ID is required to initialize logging');
    return '';
  }

  // Check if auth token exists
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.warn('No auth token available. User may need to log in.');
    return '';
  }

  // Clear any existing session to force a new one on login
  sessionId = null;
  localStorage.removeItem('loggingSessionId');

  // Try to create a new session
  try {
    console.log('Creating new logging session for user:', userId);
    const response = await axios.post(
      `${URLS.BACKEND_API_URL}/logging/create-session`,
      { source: APP_SOURCE },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    const newSessionId = response.data.sessionId;
    
    if (!newSessionId) {
      console.error('Failed to get session ID from server response');
      return '';
    }
    
    sessionId = newSessionId;
    
    // Store in localStorage for persistence
    localStorage.setItem('loggingSessionId', newSessionId);
    
    // Add event listener for page unload
    window.addEventListener('beforeunload', endSession);
    
    console.log('Logging session initialized:', newSessionId);
    return newSessionId;
  } catch (error) {
    console.error('Failed to initialize logging session:', error);
    
    // If this was an auth error, clear session data
    if (
      error && 
      typeof error === 'object' && 
      'response' in error && 
      error.response && 
      typeof error.response === 'object' && 
      'status' in error.response && 
      error.response.status === 401
    ) {
      console.warn('Authentication failed when creating session. User may need to log in again.');
    }
    
    return '';
  }
};

// End session when user leaves
const endSession = async () => {
  if (sessionId) {
    try {
      await axios.post(
        `${URLS.BACKEND_API_URL}/logging/end-session`,
        { sessionId, source: APP_SOURCE },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          }
        }
      );
      // Clear the stored session ID
      localStorage.removeItem('loggingSessionId');
      sessionId = null;
    } catch (error) {
      console.error('Failed to end logging session:', error);
    }
  }
};

// Function to track user actions
export const trackAction = async (
  userId: string,
  pageVisited: string,
  actionType: string,
  actionData?: Record<string, unknown>
) => {
  // Skip tracking if no auth token is available
  if (!localStorage.getItem('authToken')) {
    console.warn('No auth token available. Skipping analytics tracking.');
    return;
  }

  try {
    // Initialize session if not already done
    if (!sessionId) {
      console.warn('Session not initialized. Initializing now...');
      const newSessionId = await initializeLogging(userId);
      if (!newSessionId) {
        console.error('Failed to initialize session. Cannot track action.');
        return;
      }
    }

    // At this point sessionId should be set
    if (!sessionId) {
      console.error('Session ID is still null. Cannot track action.');
      return;
    }

    // Add to queue
    analyticsQueue.push({
      userId,
      sessionId,
      pageVisited,
      actionType,
      actionData,
      source: APP_SOURCE
    });

    console.log(`Tracked action: ${actionType} on page ${pageVisited}`);

    // Process queue if it reaches a certain size or immediately depending on importance
    if (analyticsQueue.length >= 5 || actionType === 'critical') {
      processQueue();
    }
  } catch (error) {
    console.error('Error tracking action:', error);
  }
};

// Process the queue by sending events to backend
const processQueue = async () => {
  if (analyticsQueue.length === 0) return;

  const events = [...analyticsQueue];
  analyticsQueue.length = 0; // Clear queue

  try {
    // Get current token
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('No auth token found, cannot send analytics events');
      // Keep events in queue for later retry
      analyticsQueue.push(...events);
      return;
    }

    const promises = events.map(event => {
      return axios.post(
        `${URLS.BACKEND_API_URL}/logging/track-action`,
        {
          sessionId: event.sessionId,
          pageVisited: event.pageVisited,
          actionType: event.actionType,
          actionData: event.actionData,
          source: event.source
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      ).catch(error => {
        // Log the specific error but don't fail the entire batch
        console.error(`Error sending analytics event (${event.actionType}):`, error.message);
        return Promise.resolve(); // Don't fail the Promise.all
      });
    });

    await Promise.all(promises);
    console.log(`Processed ${events.length} analytics events`);
  } catch (error) {
    console.error('Failed to send analytics events:', error);
    // Re-add failed events to queue
    analyticsQueue.push(...events);
    
    // If this was an auth error, we might need to reinitialize the session
    if (
      error && 
      typeof error === 'object' && 
      'response' in error && 
      error.response && 
      typeof error.response === 'object' && 
      'status' in error.response && 
      error.response.status === 401
    ) {
      console.warn('Authentication error when sending analytics, the session may need to be reinitialized');
      sessionId = null; // Force session reinit on next track
    }
  }
};

// Set up interval to process queue regularly
setInterval(processQueue, 30000); // Process every 30 seconds 

// Function to call explicitly after login
export const createSessionAfterLogin = async (userId: string): Promise<void> => {
  console.log('Creating session after login for user:', userId);
  
  // Clear any existing session data
  sessionId = null;
  localStorage.removeItem('loggingSessionId');
  
  // Initialize a fresh session
  const newSessionId = await initializeLogging(userId);
  if (!newSessionId) {
    console.error('Failed to create session after login');
  } else {
    console.log('Successfully created new session after login:', newSessionId);
  }
};

// Function to explicitly end session on logout and log the action
export const logUserLogout = async (userId: string): Promise<void> => {
  if (!userId || !sessionId) {
    console.warn('Cannot log logout - no active user or session');
    return;
  }

  try {
    // Track the logout action first
    await trackAction(
      userId,
      window.location.pathname,
      'logout',
      { timestamp: new Date().toISOString() }
    );
    
    // Process the queue immediately to ensure the logout is tracked
    await processQueue();
    
    // Then end the session
    await axios.post(
      `${URLS.BACKEND_API_URL}/logging/end-session`,
      { 
        sessionId,
        source: APP_SOURCE 
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        }
      }
    );
    
    console.log('User session ended successfully on logout');
    
    // Clear session data
    localStorage.removeItem('loggingSessionId');
    sessionId = null;
  } catch (error) {
    console.error('Error logging user logout:', error);
  }
}; 