import { Theme } from '@mui/material/styles';

// Input component styling
export const inputComponents = (theme: Theme) => ({
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        height: '56px',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: 1,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      },
      notchedOutline: {
        borderColor: theme.palette.grey[300],
        transition: theme.transitions.create(['border-color', 'border-width']),
      },
      input: {
        padding: '16.5px 14px',
        height: '1.4375em',
        boxSizing: 'content-box',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiFormLabel-root': {
          color: theme.palette.text.secondary,
          '&.Mui-focused': {
            color: theme.palette.primary.main,
          },
        },
        '& .MuiInputBase-root': {
          minHeight: '56px',
        },
      },
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          paddingLeft: theme.spacing(1),
          minHeight: '56px',
        },
        '& .MuiInputBase-input': {
          height: '1.4375em',
        },
      },
      input: {
        height: '1.4375em',
      },
      listbox: {
        padding: 0,
        maxHeight: '300px',
        '& li': {
          padding: theme.spacing(1, 1.5),
          borderBottom: `1px solid ${theme.palette.divider}`,
          '&:last-child': {
            borderBottom: 'none',
          },
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
          '&.Mui-focused': {
            backgroundColor: `${theme.palette.primary.light}20`,
          },
        },
      },
      paper: {
        margin: theme.spacing(1, 0),
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
      endAdornment: {
        top: 'calc(50% - 14px)',
      },
    },
  },
  MuiInputAdornment: {
    styleOverrides: {
      root: {
        height: '0.01em',
        '& .MuiSvgIcon-root': {
          fontSize: '1.25rem',
        },
      },
    },
  },
}); 