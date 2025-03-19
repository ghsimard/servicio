import { Theme } from '@mui/material/styles';

// Layout component styling
export const layoutComponents = (theme: Theme) => ({
  MuiContainer: {
    styleOverrides: {
      root: {
        [theme.breakpoints.up('sm')]: {
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
        },
        [theme.breakpoints.up('md')]: {
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
        },
      },
    },
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      },
      outlined: {
        border: `1px solid ${theme.palette.divider}`,
      },
      elevation1: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      },
      elevation2: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
      },
      elevation3: {
        boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
      },
      elevation4: {
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        borderRadius: 0,
      },
      colorDefault: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        overflow: 'hidden',
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: theme.spacing(2, 3),
      },
      title: {
        fontSize: '1.125rem',
        fontWeight: 600,
      },
      subheader: {
        fontSize: '0.875rem',
        color: theme.palette.text.secondary,
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: theme.spacing(2, 3),
        '&:last-child': {
          paddingBottom: theme.spacing(3),
        },
      },
    },
  },
  MuiCardActions: {
    styleOverrides: {
      root: {
        padding: theme.spacing(1, 2),
        borderTop: `1px solid ${theme.palette.divider}`,
      },
    },
  },
  MuiGrid: {
    styleOverrides: {
      container: {
        // Add more spacing for dialog forms
        '&.MuiDialogContent-root &': {
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(2),
        },
      },
      item: {
        '&.MuiDialogContent-root &': {
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
        },
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: theme.palette.divider,
      },
    },
  },
}); 