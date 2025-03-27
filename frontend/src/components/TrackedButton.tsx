import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import withClickTracking from '../utils/withClickTracking';

/**
 * A Material-UI Button with built-in click tracking
 */
const TrackedButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};

// Export the button with click tracking
export default withClickTracking(TrackedButton, 'TrackedButton');

// Example usage:
// <TrackedButton 
//   variant="contained" 
//   color="primary"
//   onClick={() => console.log('Button clicked')}
// >
//   Click Me
// </TrackedButton> 