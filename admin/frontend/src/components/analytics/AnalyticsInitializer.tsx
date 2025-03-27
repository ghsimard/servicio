import { useEffect } from 'react';
import { initializeAnalytics } from '../../utils/analytics';
import { useAuth } from '../../hooks/useAuth';

/**
 * Component to initialize analytics when the app loads
 * and the user is already authenticated
 */
const AnalyticsInitializer: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    const initAnalytics = async () => {
      // Only initialize if the user is authenticated
      if (isAuthenticated && user?.user_id) {
        try {
          console.log('Initializing analytics for user:', user.user_id);
          await initializeAnalytics(user.user_id);
        } catch (error) {
          console.error('Failed to initialize analytics:', error);
        }
      }
    };
    
    initAnalytics();
  }, [isAuthenticated, user]);
  
  // This component doesn't render anything
  return null;
};

export default AnalyticsInitializer; 