import React from 'react';
import { usePageTracking } from '../utils/usePageTracking';

interface PageTrackingLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component that tracks page views
 * Wrap route components with this to automatically track page views
 */
const PageTrackingLayout: React.FC<PageTrackingLayoutProps> = ({ children }) => {
  // Use the page tracking hook
  usePageTracking();
  
  // Simply render children without additional layout
  return <>{children}</>;
};

export default PageTrackingLayout; 