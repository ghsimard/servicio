import { Theme } from '@mui/material/styles';

// Button component styling
export const buttonComponents = (theme: Theme) => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 500,
        padding: theme.spacing(1, 2.5),
        transition: theme.transitions.create([
          'background-color',
          'box-shadow',
          'border-color',
        ]),
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      },
      containedPrimary: {
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      },
      containedSecondary: {
        backgroundColor: theme.palette.secondary.main,
        '&:hover': {
          backgroundColor: theme.palette.secondary.dark,
        },
      },
      outlined: {
        borderWidth: 1.5,
        '&:hover': {
          borderWidth: 1.5,
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
        color: theme.palette.primary.main,
      },
      textSecondary: {
        color: theme.palette.secondary.main,
      },
      startIcon: {
        marginRight: theme.spacing(0.75),
      },
      endIcon: {
        marginLeft: theme.spacing(0.75),
      },
      sizeSmall: {
        padding: theme.spacing(0.75, 1.5),
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
        borderRadius: 8,
        padding: theme.spacing(1),
        transition: theme.transitions.create('background-color'),
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      },
      sizeSmall: {
        padding: theme.spacing(0.75),
      },
      sizeLarge: {
        padding: theme.spacing(1.5),
      },
    },
  },
}); 