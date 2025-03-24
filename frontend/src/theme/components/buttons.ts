import { Theme } from '@mui/material/styles';

// Button component styling
export const buttonComponents = (theme: Theme) => ({
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: '8px',
        padding: theme.spacing(1, 2),
        transition: theme.transitions.create(
          ['background-color', 'box-shadow', 'transform'],
          {
            duration: theme.transitions.duration.short,
          }
        ),
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: theme.shadows[2],
        },
      },
      contained: {
        boxShadow: theme.shadows[2],
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      },
      containedPrimary: {
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      },
      containedSecondary: {
        '&:hover': {
          backgroundColor: theme.palette.secondary.dark,
        },
      },
      outlined: {
        borderWidth: '1px',
        '&:hover': {
          borderWidth: '1px',
          backgroundColor: `${theme.palette.primary.main}10`,
        },
      },
      outlinedPrimary: {
        borderColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: `${theme.palette.primary.main}10`,
        },
      },
      outlinedSecondary: {
        borderColor: theme.palette.secondary.main,
        '&:hover': {
          backgroundColor: `${theme.palette.secondary.main}10`,
        },
      },
      text: {
        '&:hover': {
          backgroundColor: `${theme.palette.primary.main}10`,
        },
      },
      textPrimary: {
        '&:hover': {
          backgroundColor: `${theme.palette.primary.main}10`,
        },
      },
      textSecondary: {
        '&:hover': {
          backgroundColor: `${theme.palette.secondary.main}10`,
        },
      },
      // Size variants
      sizeSmall: {
        padding: theme.spacing(0.5, 1.5),
        fontSize: '0.8125rem',
      },
      sizeLarge: {
        padding: theme.spacing(1.5, 3),
        fontSize: '1rem',
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        transition: theme.transitions.create(
          ['background-color', 'transform'],
          {
            duration: theme.transitions.duration.short,
          }
        ),
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          transform: 'scale(1.1)',
        },
        '&:active': {
          transform: 'scale(1.0)',
        },
      },
      sizeMedium: {
        padding: theme.spacing(1),
      },
      sizeSmall: {
        padding: theme.spacing(0.5),
      },
      sizeLarge: {
        padding: theme.spacing(1.5),
      },
    },
  },
}); 