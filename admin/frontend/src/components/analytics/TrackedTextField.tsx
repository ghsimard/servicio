import React, { useState, useEffect } from 'react';
import { TextField, TextFieldProps, StandardTextFieldProps } from '@mui/material';
import { trackUserAction, ACTION_TYPES } from '../../utils/analytics';
import { debounce } from 'lodash';

interface TrackedTextFieldProps extends StandardTextFieldProps {
  trackingType: 'search' | 'filter';
  trackingName: string;
  trackingData?: Record<string, any>;
  debounceTime?: number;
}

/**
 * TextField component that automatically tracks input for analytics
 */
const TrackedTextField: React.FC<TrackedTextFieldProps> = ({
  trackingType,
  trackingName,
  trackingData,
  debounceTime = 1000,
  onChange,
  ...textFieldProps
}) => {
  const [value, setValue] = useState<string>('');

  // Create a debounced function to track the search/filter action
  const trackChange = debounce((value: string) => {
    if (!value || value.trim() === '') return;
    
    trackUserAction({
      actionType: trackingType === 'search' ? ACTION_TYPES.SEARCH : ACTION_TYPES.FILTER,
      pageVisited: window.location.pathname,
      actionData: {
        field: trackingName,
        value,
        ...trackingData,
      },
    });
  }, debounceTime);

  // Cancel the debounce on unmount
  useEffect(() => {
    return () => {
      trackChange.cancel();
    };
  }, [trackChange]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    
    // Track the search/filter after delay
    trackChange(newValue);
    
    // Call the original onChange handler if provided
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <TextField
      onChange={handleChange}
      value={value}
      {...textFieldProps}
    />
  );
};

export default TrackedTextField; 