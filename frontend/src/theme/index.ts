import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';
import { transitions } from './transitions';
import { components } from './components';

// Create the base theme with palette, typography, and transitions
const baseTheme = createTheme({
  palette,
  typography,
  transitions,
  shape: {
    borderRadius: 8,
  },
});

// Create the final theme with components that depend on the base theme
const theme = createTheme(baseTheme, {
  components: components(baseTheme),
});

export default theme; 