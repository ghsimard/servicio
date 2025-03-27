import axios from 'axios';

export const ACTION_TYPES = {
  PAGE_VIEW: 'page_view',
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  DATA_CREATE: 'data_create',
  DATA_UPDATE: 'data_update',
  DATA_DELETE: 'data_delete',
  SEARCH: 'search',
  FILTER: 'filter',
  EXPORT: 'export',
  LOGIN: 'login',
  LOGOUT: 'logout',
  ERROR: 'error',
};

// Queue for batching analytics events
let analyticsQueue: any[] = [];
const MAX_QUEUE_SIZE = 10;
const FLUSH_INTERVAL = 30000; // 30 seconds

/**
 * Track a user action
 */
export const trackUserAction = (params: {
  actionType: string;
  pageVisited: string;
  actionData?: any;
}) => {
  try {
    const userId = localStorage.getItem('userId');
    const sessionId = localStorage.getItem('sessionId');
    const token = localStorage.getItem('token');
    
    if (!userId || !sessionId || !token) {
      console.debug('Missing user info, action not tracked', { userId, sessionId });
      return;
    }
    
    // Add to queue
    analyticsQueue.push({
      ...params,
      sessionId,
      timestamp: new Date().toISOString(),
    });
    
    // Flush if queue is full
    if (analyticsQueue.length >= MAX_QUEUE_SIZE) {
      flushAnalyticsQueue();
    }
  } catch (error) {
    // Silent fail - analytics should never break the application
    console.debug('Error queueing analytics:', error);
  }
};

/**
 * Flush the analytics queue
 */
const flushAnalyticsQueue = async () => {
  if (analyticsQueue.length === 0) return;
  
  const events = [...analyticsQueue];
  analyticsQueue = [];
  
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // Send events one by one to match the current API
    // In the future, consider implementing a batch endpoint
    await Promise.all(
      events.map(event => 
        axios.post('/analytics/track', event, {
          headers: { Authorization: `Bearer ${token}` }
        })
      )
    );
  } catch (error) {
    console.debug('Error sending analytics:', error);
    // Don't retry for now
  }
};

// Set up interval to flush events
setInterval(flushAnalyticsQueue, FLUSH_INTERVAL);

// Flush events on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    flushAnalyticsQueue();
  });
}

/**
 * Create a tracked version of a function
 */
export const withTracking = (
  fn: (...args: any[]) => any,
  actionType: string,
  getData?: (...args: any[]) => any
) => {
  return (...args: any[]) => {
    try {
      // Call the original function
      const result = fn(...args);
      
      // Track the action
      trackUserAction({
        actionType,
        pageVisited: typeof window !== 'undefined' ? window.location.pathname : '',
        actionData: getData ? getData(...args) : { args },
      });
      
      return result;
    } catch (error) {
      // Track the error
      trackUserAction({
        actionType: ACTION_TYPES.ERROR,
        pageVisited: typeof window !== 'undefined' ? window.location.pathname : '',
        actionData: {
          errorMessage: error instanceof Error ? error.message : String(error),
          actionType,
        },
      });
      
      // Re-throw to keep original behavior
      throw error;
    }
  };
}; 