import { Theme } from '@mui/material/styles';

// Input component styling
export const inputComponents = (theme: Theme) => ({
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      fullWidth: true,
    },
    styleOverrides: {
      root: {
        marginBottom: theme.spacing(2),
        '& .MuiOutlinedInput-root': {
          transition: theme.transitions.create(
            ['border-color', 'box-shadow', 'transform'],
            {
              duration: theme.transitions.duration.shorter,
            }
          ),
          '& fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
            borderWidth: '1px',
            transition: theme.transitions.create(['border-color', 'border-width']),
          },
          '&:hover fieldset': {
            borderColor: theme.palette.primary.light,
          },
          '&.Mui-focused': {
            '& fieldset': {
              borderColor: theme.palette.primary.main,
              borderWidth: '2px',
            },
            boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`,
          },
          '&.Mui-error fieldset': {
            borderColor: theme.palette.error.main,
          },
        },
        '& .MuiInputLabel-root': {
          transition: theme.transitions.create(['color', 'transform']),
          '&.Mui-focused': {
            color: theme.palette.primary.main,
            fontWeight: 500,
          },
        },
        '& .MuiInputBase-input': {
          transition: theme.transitions.create('background-color'),
          '&:focus': {
            backgroundColor: `${theme.palette.primary.main}05`,
          },
        },
      },
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      root: {
        '& .MuiAutocomplete-inputRoot': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
            borderWidth: '1px',
            transition: theme.transitions.create(['border-color', 'border-width']),
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.light,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
            borderWidth: '2px',
          },
        },
        '& .MuiAutocomplete-tag': {
          backgroundColor: theme.palette.primary.light + '40',
          color: theme.palette.primary.dark,
          margin: theme.spacing(0.5),
        },
      },
      listbox: {
        padding: theme.spacing(1),
        '& .MuiAutocomplete-option': {
          padding: theme.spacing(1, 2),
          borderRadius: theme.shape.borderRadius,
          '&[aria-selected="true"]': {
            backgroundColor: theme.palette.primary.light + '40',
            '&.Mui-focused': {
              backgroundColor: theme.palette.primary.light + '60',
            },
          },
          '&.Mui-focused': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
      },
      input: {
        padding: theme.spacing(1.5, 2),
        '&::placeholder': {
          opacity: 0.7,
          color: theme.palette.text.secondary,
        },
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      select: {
        padding: theme.spacing(1.5, 2),
      },
    },
  },
}); 