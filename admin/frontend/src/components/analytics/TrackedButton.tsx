import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { trackUserAction, ACTION_TYPES } from '../../utils/analytics';

interface TrackedButtonProps extends ButtonProps {
  trackingName: string;
  trackingData?: Record<string, any>;
}

/**
 * Button component that automatically tracks clicks for analytics
 */
const TrackedButton: React.FC<TrackedButtonProps> = ({
  trackingName,
  trackingData,
  onClick,
  children,
  ...buttonProps
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Track the button click
    trackUserAction({
      actionType: ACTION_TYPES.BUTTON_CLICK,
      pageVisited: window.location.pathname,
      actionData: {
        button: trackingName,
        ...trackingData
      }
    });

    // Call the original onClick handler if provided
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Button
      onClick={handleClick}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};

export default TrackedButton; 