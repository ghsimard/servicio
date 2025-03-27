import React from 'react';
import { useLogging } from '../contexts/LoggingContext';
import { useLocation } from 'react-router-dom';

// Define an interface for clickable props
interface ClickableProps {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Higher-order component (HOC) that adds click tracking to any component
 * @param Component The component to wrap with click tracking
 * @param componentName The name of the component for logging purposes
 * @param additionalData Optional additional data to include with the tracking event
 */
export const withClickTracking = <P extends ClickableProps>(
  Component: React.ComponentType<P>,
  componentName: string,
  additionalData?: Record<string, unknown>
) => {
  const WithClickTracking: React.FC<P> = (props) => {
    const { trackUserAction } = useLogging();
    const location = useLocation();
    
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      // Get element data
      const element = e.currentTarget;
      const text = element.textContent || 'unknown';
      const elementId = element.id || 'unknown';
      const classes = Array.from(element.classList).join(' ') || 'unknown';
      
      // Track the click
      trackUserAction(
        location.pathname,
        'ui_interaction',
        {
          interactionType: 'click',
          componentName, 
          element: {
            type: element.tagName.toLowerCase(),
            text: text.trim().substring(0, 50), // Truncate long text
            id: elementId,
            classes
          },
          ...additionalData
        }
      );
    };
    
    // Clone the component with an onClick handler that tracks clicks
    return (
      <Component
        {...props}
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          // Call the original onClick if it exists
          if (props.onClick) {
            props.onClick(e);
          }
          
          // Track the click
          handleClick(e);
        }}
      />
    );
  };
  
  // Set display name for easier debugging
  const displayName = Component.displayName || Component.name || 'Component';
  WithClickTracking.displayName = `withClickTracking(${displayName})`;
  
  return WithClickTracking;
};

export default withClickTracking; 