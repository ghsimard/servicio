import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../utils/analytics';

/**
 * Component that tracks route changes and sends analytics data
 */
const RouteTracker: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Track page view when route changes
    trackPageView(location.pathname);
  }, [location.pathname, location.search]);
  
  // This component doesn't render anything
  return null;
};

export default RouteTracker; 