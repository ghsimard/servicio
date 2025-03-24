import { Theme } from '@mui/material/styles';

// Dialog component styling
export const dialogComponents = (theme: Theme) => ({
  MuiDialog: {
    defaultProps: {
      closeAfterTransition: false, // Fix for a11y issue with aria-hidden
    },
    styleOverrides: {
      paper: {
        borderRadius: 16,
        boxShadow: '0px 20px 40px rgba(255, 107, 0, 0.15)',
        margin: theme.spacing(2),
        maxWidth: `calc(100% - ${theme.spacing(4)})`,
        overflow: 'visible', // Changed from 'hidden' to allow dropdowns to overflow
        backgroundColor: theme.palette.background.paper,
      },
      paperWidthXs: {
        maxWidth: theme.breakpoints.values.xs,
        [theme.breakpoints.down('sm')]: {
          maxWidth: `calc(100% - ${theme.spacing(4)})`,
        },
      },
      paperWidthSm: {
        maxWidth: theme.breakpoints.values.sm,
        [theme.breakpoints.down('md')]: {
          maxWidth: `calc(100% - ${theme.spacing(4)})`,
        },
      },
      paperWidthMd: {
        maxWidth: theme.breakpoints.values.md,
        [theme.breakpoints.down('lg')]: {
          maxWidth: `calc(100% - ${theme.spacing(4)})`,
        },
      },
      paperFullScreen: {
        borderRadius: 0,
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        padding: theme.spacing(3),
        borderBottom: `1px solid ${theme.palette.divider}`,
        '& .MuiTypography-root': {
          fontSize: '1.25rem',
          fontWeight: 600,
          color: theme.palette.primary.main,
        },
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 2px 4px rgba(255, 107, 0, 0.05)',
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.paper,
        '& .MuiGrid-container': {
          marginTop: theme.spacing(1),
        },
        '& .MuiFormControl-root': {
          marginBottom: theme.spacing(1),
        },
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: theme.spacing(2, 3),
        borderTop: `1px solid ${theme.palette.divider}`,
        gap: theme.spacing(1),
        backgroundColor: theme.palette.grey[50],
      },
    },
  },
  MuiDialogContentText: {
    styleOverrides: {
      root: {
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(2),
      },
    },
  },
}); 