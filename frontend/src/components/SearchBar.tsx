import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  InputBase,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Box,
  Autocomplete,
  CircularProgress,
  Typography,
  Button,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import ClearIcon from '@mui/icons-material/Clear';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface Service {
  service_id: string;
  name: string;
}

const API_BASE_URL = 'http://localhost:3001/api';

const highlightMatch = (text: string, query: string) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) => 
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} style={{ textDecoration: 'underline' }} aria-label={`matched text: ${part}`}>{part}</span>
    ) : part
  );
};

export default function SearchBar() {
  const { t } = useTranslation();
  const { announceMessage } = useAccessibility();
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [advancedSearch, setAdvancedSearch] = useState({
    service: null as Service | null,
    location: '',
    priceRange: '',
    availability: '',
  });

  useEffect(() => {
    if (loading) {
      announceMessage(t('search.loading'));
    } else if (services.length > 0) {
      announceMessage(t('search.resultsFound', { count: services.length }));
    } else if (searchQuery.length >= 2 && !loading) {
      announceMessage(t('search.noResults'));
    }
  }, [loading, services, searchQuery, announceMessage, t]);

  const fetchServices = async (query: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/services/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
      announceMessage(t('search.error'));
    } finally {
      setLoading(false);
    }
  };

  function debounce<F extends (...args: string[]) => void>(
    func: F,
    waitFor: number
  ) {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<F>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), waitFor);
    };
  }

  const debouncedFetchServices = debounce((query: string) => {
    fetchServices(query);
  }, 300);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    fetchServices(searchQuery);
  };

  const handleAdvancedSearch = () => {
    if (advancedSearch.service) {
      fetchServices(advancedSearch.service.name);
    }
    setOpenAdvanced(false);
    announceMessage(t('search.advancedSearchCompleted'));
  };

  const handleClearAdvanced = () => {
    setAdvancedSearch({
      service: null,
      location: '',
      priceRange: '',
      availability: '',
    });
    setSearchQuery('');
    setServices([]);
    announceMessage(t('search.cleared'));
  };

  const handleInputChange = (newValue: string | null, reason: string) => {
    const value = newValue || '';
    setSearchQuery(value);
    
    if (value.length >= 2) {
      debouncedFetchServices(value);
    } else {
      setServices([]);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSearch}
        role="search"
        aria-label={t('search.mainSearch')}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          width: '100%',
          minWidth: '100%',
          gap: { xs: 1, sm: 2 },
          mx: 'auto',
          px: { xs: 2, sm: 3 }
        }}
      >
        <Box 
          sx={{ 
            flex: { xs: 1, sm: 1 },
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          <Box sx={{ 
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 3,
            display: 'flex',
            alignItems: 'center'
          }}>
            <Autocomplete
              sx={{ 
                flex: 1,
                '& .MuiAutocomplete-popper': {
                  position: 'relative !important'
                }
              }}
              options={services}
              value={null}
              inputValue={searchQuery}
              onChange={(event, newValue) => {
                if (newValue) {
                  const selectedService = typeof newValue === 'string' 
                    ? { service_id: '', name: newValue } 
                    : newValue;
                  
                  setSearchQuery(selectedService.name);
                  setAdvancedSearch(prev => ({
                    ...prev,
                    service: selectedService
                  }));
                  setServices([]);
                  setIsDropdownOpen(false);
                  announceMessage(t('search.serviceSelected', { name: selectedService.name }));
                }
              }}
              onInputChange={(event, newValue, reason) => {
                if (reason === 'reset') {
                  return;
                }
                handleInputChange(newValue, reason);
              }}
              onClose={() => {
                setIsDropdownOpen(false);
              }}
              onOpen={() => {
                if (searchQuery.length >= 2) {
                  setIsDropdownOpen(true);
                  fetchServices(searchQuery);
                }
              }}
              freeSolo
              getOptionLabel={(option) => {
                return typeof option === 'string' ? option : option.name;
              }}
              renderInput={(params) => (
                <Box
                  ref={params.InputProps.ref}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%'
                  }}
                >
                  <InputBase
                    fullWidth
                    inputProps={{
                      ...params.inputProps,
                      'aria-label': t('search.serviceInput'),
                      placeholder: t('search.service')
                    }}
                    endAdornment={
                      loading ? <CircularProgress color="inherit" size={20} aria-label={t('search.loading')} /> : null
                    }
                    sx={{ 
                      width: '100%',
                      '& input': { p: 1.5 }
                    }}
                  />
                </Box>
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.service_id} style={{ paddingLeft: '12px' }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500,
                      width: '100%',
                      textAlign: 'left'
                    }}
                    role="option"
                    aria-selected={props['aria-selected']}
                  >
                    {highlightMatch(typeof option === 'string' ? option : option.name, searchQuery)}
                  </Typography>
                </li>
              )}
              componentsProps={{
                paper: {
                  sx: {
                    width: '100%',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    backgroundColor: 'white',
                    marginTop: '8px',
                    '& .MuiAutocomplete-listbox': {
                      padding: 0,
                      maxHeight: '300px',
                      '& li': {
                        padding: '8px 0',
                        paddingLeft: '12px !important',
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        '&:last-child': {
                          borderBottom: 'none'
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.04)'
                        },
                        '& .MuiTypography-root': {
                          marginLeft: 0
                        }
                      }
                    }
                  }
                }
              }}
              loading={loading}
              loadingText={t('search.loading')}
              noOptionsText={searchQuery.length < 2 ? t('search.minChars') : t('search.noResults')}
              open={isDropdownOpen && searchQuery.length >= 2 && services.length > 0}
              forcePopupIcon={false}
              disablePortal
            />
          </Box>
        </Box>
        <Box sx={{ 
          flex: { xs: 1, sm: 1 },
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          display: 'flex',
          alignItems: 'center',
          width: '100%'
        }}>
          <InputBase
            sx={{ 
              flex: 1,
              '& input': { p: 1.5 }
            }}
            placeholder={t('search.location')}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            inputProps={{
              'aria-label': t('search.locationInput')
            }}
          />
        </Box>
        <Box sx={{
          display: 'flex',
          gap: 0.5,
          justifyContent: { xs: 'center', sm: 'flex-start' },
          mt: { xs: 1, sm: 0 },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <IconButton
            type="submit"
            aria-label={t('search.submit')}
            sx={{ 
              p: '10px',
              bgcolor: 'white',
              boxShadow: 3,
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            <SearchIcon />
          </IconButton>
          <IconButton 
            onClick={() => setOpenAdvanced(true)}
            aria-label={t('search.openAdvanced')}
            sx={{ 
              p: '10px',
              bgcolor: 'white',
              boxShadow: 3,
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            <TuneIcon />
          </IconButton>
        </Box>
      </Box>

      <Dialog 
        open={openAdvanced} 
        onClose={() => setOpenAdvanced(false)} 
        maxWidth="sm" 
        fullWidth
        aria-labelledby="advanced-search-dialog"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            bgcolor: 'white'
          }
        }}
      >
        <DialogTitle 
          id="advanced-search-dialog"
          sx={{ 
            px: 4,
            py: 3,
            fontSize: '1.5rem',
            fontWeight: 500,
            color: '#1a1a1a'
          }}
        >
          {t('search.advancedSearch')}
        </DialogTitle>
        <DialogContent sx={{ px: 4, pt: 6, pb: 5, bgcolor: 'white' }}>
          <Box role="form" aria-label={t('search.advancedSearchForm')}>
            <Grid container spacing={3}>
              {[
                { name: 'service', label: t('search.service'), type: 'autocomplete' },
                { name: 'location', label: t('search.location'), type: 'text' },
                { name: 'priceRange', label: t('search.priceRange'), type: 'text' },
                { name: 'availability', label: t('search.availability'), type: 'text' }
              ].map((field) => (
                <Grid item xs={12} key={field.name}>
                  {field.type === 'autocomplete' ? (
                    <Autocomplete
                      fullWidth
                      options={services}
                      value={advancedSearch.service}
                      onChange={(event, newValue) => {
                        setAdvancedSearch({ ...advancedSearch, service: newValue });
                        setServices([]);
                        setIsDropdownOpen(false);
                        if (newValue) {
                          announceMessage(t('search.serviceSelected', { name: newValue.name }));
                        }
                      }}
                      onInputChange={(event, newValue, reason) => {
                        if (reason === 'reset') return;
                        handleInputChange(newValue, reason);
                      }}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) => option.service_id === value?.service_id}
                      loading={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          placeholder={field.label}
                          InputProps={{
                            ...params.InputProps,
                            'aria-label': field.label,
                            notched: false,
                            endAdornment: (
                              <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                top: 0,
                                border: '1px solid rgba(0,0,0,0.23) !important',
                                '& legend': {
                                  display: 'none'
                                }
                              },
                              '&:hover fieldset': {
                                border: '1px solid rgba(0,0,0,0.87) !important'
                              },
                              '&.Mui-focused fieldset': {
                                border: '2px solid !important',
                                borderColor: 'primary.main !important'
                              }
                            }
                          }}
                        />
                      )}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder={field.label}
                      value={advancedSearch[field.name as keyof typeof advancedSearch]}
                      onChange={(e) => setAdvancedSearch({ 
                        ...advancedSearch, 
                        [field.name]: e.target.value 
                      })}
                      InputProps={{
                        notched: false,
                        'aria-label': field.label
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            top: 0,
                            border: '1px solid rgba(0,0,0,0.23) !important',
                            '& legend': {
                              display: 'none'
                            }
                          },
                          '&:hover fieldset': {
                            border: '1px solid rgba(0,0,0,0.87) !important'
                          },
                          '&.Mui-focused fieldset': {
                            border: '2px solid !important',
                            borderColor: 'primary.main !important'
                          }
                        }
                      }}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions 
          sx={{ 
            px: 4,
            py: 3,
            borderTop: '1px solid rgba(0,0,0,0.08)',
            gap: 2,
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'white'
          }}
        >
          <Button 
            onClick={handleClearAdvanced}
            startIcon={<ClearIcon />}
            aria-label={t('search.clearForm')}
            sx={{
              bgcolor: 'white',
              boxShadow: 3,
              color: 'text.primary',
              textTransform: 'none',
              fontSize: '0.95rem',
              p: '10px',
              minWidth: 0,
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            {t('common.clear')}
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button 
            onClick={() => setOpenAdvanced(false)}
            aria-label={t('common.close')}
            sx={{
              bgcolor: 'white',
              boxShadow: 3,
              color: 'text.primary',
              textTransform: 'none',
              fontSize: '0.95rem',
              p: '10px',
              minWidth: 0,
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            {t('common.close')}
          </Button>
          <Button 
            onClick={handleAdvancedSearch}
            startIcon={<SearchIcon />}
            aria-label={t('search.performAdvancedSearch')}
            sx={{
              bgcolor: 'white',
              boxShadow: 3,
              color: 'text.primary',
              textTransform: 'none',
              fontSize: '0.95rem',
              p: '10px',
              minWidth: 0,
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            {t('search.search')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 