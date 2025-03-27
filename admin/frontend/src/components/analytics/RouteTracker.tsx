import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackUserAction, ACTION_TYPES } from '../../utils/analytics';

/**
 * Component that tracks route changes and sends analytics data
 */
const RouteTracker: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Track page view when route changes
    trackUserAction({
      actionType: ACTION_TYPES.PAGE_VIEW,
      pageVisited: location.pathname,
      actionData: {
        path: location.pathname,
        query: location.search,
        timestamp: new Date().toISOString(),
      },
    });
  }, [location.pathname, location.search]);
  
  // This component doesn't render anything
  return null;
};

export default RouteTracker; 