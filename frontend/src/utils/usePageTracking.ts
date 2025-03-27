import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLogging } from '../contexts/LoggingContext';

/**
 * A custom hook that tracks page views.
 * Place this in layout components to automatically track page views.
 */
export const usePageTracking = () => {
  const location = useLocation();
  const { trackUserAction } = useLogging();

  useEffect(() => {
    const currentPage = location.pathname;
    
    // Track the page view
    trackUserAction(
      currentPage,
      'page_view',
      {
        path: currentPage,
        search: location.search,
        hash: location.hash,
        referrer: document.referrer
      }
    );
  }, [location, trackUserAction]);
}; 