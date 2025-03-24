import { Theme } from '@mui/material/styles';
import { inputComponents } from './input';
import { buttonComponents } from './button';
import { layoutComponents } from './layout';
import { dialogComponents } from './dialog';

// Combine all component styles
export const components = (theme: Theme) => ({
  ...inputComponents(theme),
  ...buttonComponents(theme),
  ...layoutComponents(theme),
  ...dialogComponents(theme),
}); 