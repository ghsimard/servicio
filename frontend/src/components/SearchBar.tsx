import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TextField,
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
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import ClearIcon from '@mui/icons-material/Clear';
import HistoryIcon from '@mui/icons-material/History';
import { useAccessibility } from '../contexts/AccessibilityContext';
import LocationInput from './LocationInput';
import { API_BASE_URL } from '../config';

// Temporary interface to handle both old and new API formats
interface Service {
  service_id: string;
  name_en: string;
  name_fr?: string | null;
  name_es?: string | null;
}

// Maximum number of search history items to store
const MAX_HISTORY_ITEMS = 10;

// Local storage key for search history
const SEARCH_HISTORY_KEY = 'serviceSearchHistory';

export default function SearchBar() {
  const { t, i18n } = useTranslation();
  const { announceMessage } = useAccessibility();
  const theme = useTheme();
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<Service[]>([]);
  
  const [advancedSearch, setAdvancedSearch] = useState({
    service: null as Service | null,
    location: location,
    priceRange: '',
    availability: '',
  });

  // Load search history from local storage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        setSearchHistory(parsedHistory);
      } catch (error) {
        console.error('Error parsing search history:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (loading) {
      announceMessage(t('search.loading'));
    } else if (services.length > 0) {
      announceMessage(t('search.resultsFound', { count: services.length }));
    } else if (searchQuery.length >= 3 && !loading) {
      announceMessage(t('search.noResults'));
    }
  }, [loading, services, searchQuery, announceMessage, t]);

  // Add effect to sync location values
  useEffect(() => {
    setAdvancedSearch(prev => ({
      ...prev,
      location: location
    }));
  }, [location]);

  const fetchServices = async (query: string) => {
    try {
      setLoading(true);
      const currentLang = i18n.language;
      const response = await fetch(`${API_BASE_URL}/services/search?query=${encodeURIComponent(query)}&lang=${currentLang}`);
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
      const searchTerm = getLocalizedName(advancedSearch.service);
      fetchServices(searchTerm);
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
    setLocation('');
    setServices([]);
    announceMessage(t('search.cleared'));
  };

  const handleInputChange = (newValue: string | null) => {
    const value = newValue || '';
    setSearchQuery(value);
    
    if (value.length >= 3) {
      debouncedFetchServices(value);
    } else if (value.length > 0 && value.length < 3) {
      // Show search history when typing the first or second letter
      setServices([]);
      setIsDropdownOpen(true);
    } else {
      setServices([]);
      setIsDropdownOpen(false);
    }
  };

  const handleLocationChange = (newValue: string) => {
    setLocation(newValue);
    setAdvancedSearch(prev => ({
      ...prev,
      location: newValue
    }));
  };

  // Function to get the service name based on current language
  const getLocalizedName = (service: Service): string => {
    const currentLang = i18n.language;
    
    // Handle both old and new API formats
    const name_en = service.name_en || '';
    
    if (currentLang === 'fr' && service.name_fr) {
      return service.name_fr;
    } else if (currentLang === 'es' && service.name_es) {
      return service.name_es;
    }
    
    // Default to English
    return name_en;
  };

  // Add a service to search history
  const addToSearchHistory = (service: Service) => {
    // Create a new history array without the selected service (if it exists)
    const filteredHistory = searchHistory.filter(item => item.service_id !== service.service_id);
    
    // Add the service to the beginning of the array
    const newHistory = [service, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
    
    // Update state and local storage
    setSearchHistory(newHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  };

  // Get options to display based on query length
  const getDisplayOptions = () => {
    if (searchQuery.length >= 3) {
      return services;
    } else if (searchQuery.length > 0) {
      // Filter history by the first letters
      return searchHistory.filter(service => 
        getLocalizedName(service).toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }
    return [];
  };

  const displayOptions = getDisplayOptions();
  const showDropdown = isDropdownOpen && 
    ((searchQuery.length >= 3 && services.length > 0) || 
     (searchQuery.length > 0 && searchQuery.length < 3 && searchHistory.length > 0));

  // Common styles for input fields - using theme for consistent styling with enhanced effects
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      transition: theme.transitions.create(['border-color', 'transform'], {
        duration: theme.transitions.duration.shorter
      }),
      '& fieldset': { 
        borderColor: 'rgba(0, 0, 0, 0.23)', 
        borderWidth: '1px',
        transition: theme.transitions.create(['border-color', 'border-width'])
      },
      '&:hover fieldset': { 
        borderColor: theme.palette.primary.light 
      },
      '&.Mui-focused': {
        '& fieldset': { 
          borderColor: theme.palette.primary.main, 
          borderWidth: '2px' 
        }
      },
      '&.Mui-error fieldset': { 
        borderColor: theme.palette.error.main 
      }
    },
    '& .MuiInputLabel-root': {
      transition: theme.transitions.create(['color', 'transform']),
      '&.Mui-focused': { 
        color: theme.palette.primary.main,
        fontWeight: 500
      }
    },
    '& .MuiInputBase-input': {
      transition: theme.transitions.create('background-color'),
      '&:focus': {
        backgroundColor: `${theme.palette.primary.main}05`
      }
    }
  };

  // Common styles for buttons using theme
  const buttonStyles = {
    bgcolor: 'white',
    color: theme.palette.text.primary,
    textTransform: 'none',
    fontSize: '0.95rem',
    p: '10px',
    minWidth: 0,
    transition: theme.transitions.create(['background-color', 'transform'], {
      duration: theme.transitions.duration.short
    }),
    '&:hover': {
      bgcolor: theme.palette.grey[100],
      transform: 'translateY(-1px)'
    },
    '&:active': {
      transform: 'translateY(0)'
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} style={{ textDecoration: 'underline' }} aria-label={`matched text: ${part}`}>{part}</span>
      ) : part
    );
  };

  // Common styles for search containers
  const searchContainerStyles = {
    bgcolor: 'white',
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    transition: theme.transitions.create(['transform'], {
      duration: theme.transitions.duration.short
    }),
    '&:focus-within': {
      transform: 'translateY(-2px)'
    }
  };

  const handleAdvancedServiceChange = (newValue: string | Service | null) => {
    if (newValue) {
      const selectedService = typeof newValue === 'string' 
        ? { service_id: '', name_en: newValue, name_fr: null, name_es: null }
        : newValue;
      
      const serviceName = getLocalizedName(selectedService);
      announceMessage(t('search.serviceSelected', { name: serviceName }));
      setAdvancedSearch({
        ...advancedSearch,
        service: selectedService
      });
      // Sync with main search bar and prevent dropdown
      setSearchQuery(serviceName);
      setIsDropdownOpen(false);
      addToSearchHistory(selectedService);
    } else {
      setAdvancedSearch({
        ...advancedSearch,
        service: null
      });
      setSearchQuery('');
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
          px: { xs: 2, sm: 3 },
          position: 'relative',
          '& .MuiAutocomplete-popper': {
            zIndex: 1300
          }
        }}
      >
        <Box
          sx={{
            flex: { xs: 1, sm: 0.45 },
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '100%', sm: '45%' },
            minWidth: { xs: '100%', sm: '250px' },
            zIndex: 1
          }}
        >
          <Box sx={searchContainerStyles}>
            <Autocomplete
              id="service-search"
              sx={{ 
                flex: 1,
                '& .MuiAutocomplete-popper': {
                  zIndex: 1300
                },
                flexGrow: 1,
                '& .MuiAutocomplete-endAdornment': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  position: 'absolute',
                  right: '9px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                },
                '& .MuiAutocomplete-clearIndicator': {
                  visibility: searchQuery ? 'visible' : 'hidden',
                  padding: '2px',
                  color: 'action.active',
                  '&:hover': {
                    color: 'action.active',
                    backgroundColor: 'action.hover'
                  }
                },
                '& .MuiAutocomplete-clearIndicator svg': {
                  fontSize: '18px',
                  display: 'block'
                }
              }}
              options={displayOptions}
              value={null}
              inputValue={searchQuery}
              onChange={(event, newValue) => {
                if (newValue) {
                  const selectedService = typeof newValue === 'string' 
                    ? { service_id: '', name_en: newValue, name_fr: null, name_es: null } 
                    : newValue;
                  
                  setSearchQuery(getLocalizedName(selectedService));
                  setAdvancedSearch(prev => ({
                    ...prev,
                    service: selectedService
                  }));
                  
                  // Add to search history
                  addToSearchHistory(selectedService);
                  
                  setServices([]);
                  setIsDropdownOpen(false);
                  announceMessage(t('search.serviceSelected', { name: getLocalizedName(selectedService) }));
                }
              }}
              onInputChange={(event, newValue, reason) => {
                if (reason === 'reset' || reason === 'clear') {
                  setIsDropdownOpen(false);
                  setSearchQuery('');
                  setAdvancedSearch(prev => ({
                    ...prev,
                    service: null
                  }));
                  return;
                }
                handleInputChange(newValue);
              }}
              onClose={() => {
                setIsDropdownOpen(false);
              }}
              onOpen={(event) => {
                // Only open dropdown if user is actively typing or clicking
                if (event?.type === 'click' || event?.type === 'keydown') {
                  if (searchQuery.length >= 3) {
                    setIsDropdownOpen(true);
                    fetchServices(searchQuery);
                  } else if (searchQuery.length > 0 && searchQuery.length < 3 && searchHistory.length > 0) {
                    setIsDropdownOpen(true);
                  }
                }
              }}
              open={showDropdown}
              freeSolo
              forcePopupIcon={false}
              disablePortal
              getOptionLabel={(option) => {
                return typeof option === 'string' ? option : getLocalizedName(option);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  variant="outlined"
                  placeholder={t('search.service')}
                  label={t('search.service')}
                  InputProps={{
                    ...params.InputProps,
                    'aria-label': t('search.serviceInput'),
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    ...textFieldStyles,
                    '& .MuiOutlinedInput-root': {
                      ...textFieldStyles['& .MuiOutlinedInput-root'],
                      borderRadius: 2,
                    }
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.service_id} style={{ paddingLeft: '12px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {searchHistory.some(item => item.service_id === option.service_id) && searchQuery.length === 1 && (
                      <HistoryIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    )}
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
                      {highlightMatch(typeof option === 'string' ? option : getLocalizedName(option), searchQuery)}
                    </Typography>
                  </Box>
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
                    zIndex: 1300
                  }
                },
                popper: {
                  sx: {
                    zIndex: 1300
                  }
                }
              }}
              loading={loading}
              loadingText={t('search.loading')}
              noOptionsText={searchQuery.length === 1 || searchQuery.length === 2 ? t('search.noHistory') : searchQuery.length < 3 ? t('search.minChars') : t('search.noResults')}
            />
          </Box>
        </Box>
        <Box sx={{ 
          flex: { xs: 1, sm: 0.45 },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: { xs: '100%', sm: '45%' },
          minWidth: { xs: '100%', sm: '250px' },
          zIndex: 0
        }}>
          <Box sx={searchContainerStyles}>
            <LocationInput
              value={location}
              onChange={handleLocationChange}
              label={t('search.location')}
              placeholder={t('search.location')}
              fullWidth
              width="100%"
              sx={{
                ...textFieldStyles,
                '& .MuiOutlinedInput-root': {
                  ...textFieldStyles['& .MuiOutlinedInput-root'],
                  borderRadius: 2,
                }
              }}
            />
          </Box>
        </Box>
        <Box sx={{
          display: 'flex',
          gap: 0.5,
          justifyContent: { xs: 'center', sm: 'flex-start' },
          mt: { xs: 1, sm: 0 },
          width: { xs: '100%', sm: 'auto' },
          position: 'relative',
          zIndex: 0
        }}>
          <IconButton
            type="submit"
            aria-label={t('search.submit')}
            sx={{ 
              ...buttonStyles,
              position: 'relative',
              zIndex: 0
            }}
          >
            <SearchIcon />
          </IconButton>
          <IconButton 
            onClick={() => setOpenAdvanced(true)}
            aria-label={t('search.openAdvanced')}
            sx={{ 
              ...buttonStyles,
              position: 'relative',
              zIndex: 0
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
            bgcolor: 'white',
            overflow: 'hidden',
            transition: theme.transitions.create(['transform', 'opacity']),
            mt: 10,
            '& .MuiDialogTitle-root': {
              px: 4,
              py: 3,
              fontSize: '1.5rem',
              fontWeight: 500,
              color: theme.palette.text.primary,
              borderBottom: `1px solid ${theme.palette.divider}`
            },
            '& .MuiDialogContent-root': {
              px: 4, 
              pt: 3, 
              pb: 3,
              bgcolor: 'white'
            },
            '& .MuiDialogActions-root': {
              px: 4,
              py: 3,
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: 'white'
            }
          }
        }}
        TransitionProps={{
          timeout: {
            enter: theme.transitions.duration.enteringScreen,
            exit: theme.transitions.duration.leavingScreen
          }
        }}
      >
        <DialogTitle 
          id="advanced-search-dialog"
        >
          {t('search.advancedSearch')}
        </DialogTitle>
        <DialogContent>
          <Box role="form" aria-label={t('search.advancedSearchForm')}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Autocomplete
                  id="advanced-service-search"
                  fullWidth
                  options={services}
                  value={advancedSearch.service}
                  onChange={(e, newValue) => handleAdvancedServiceChange(newValue)}
                  onInputChange={(event, newValue, reason) => {
                    if (reason === 'reset' || reason === 'clear') {
                      setSearchQuery('');
                      setAdvancedSearch(prev => ({
                        ...prev,
                        service: null
                      }));
                      return;
                    }
                    handleInputChange(newValue);
                  }}
                  getOptionLabel={(option) => {
                    return typeof option === 'string' ? option : getLocalizedName(option);
                  }}
                  isOptionEqualToValue={(option, value) => option.service_id === value?.service_id}
                  loading={loading}
                  noOptionsText={searchQuery.length === 0 ? t('search.minChars') : t('search.noResults')}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      placeholder={t('search.service')}
                      label={t('search.service')}
                      InputProps={{
                        ...params.InputProps,
                        'aria-label': t('search.serviceInput'),
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      sx={textFieldStyles}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.service_id} style={{ paddingLeft: '12px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        {searchHistory.some(item => item.service_id === option.service_id) && searchQuery.length === 1 && (
                          <HistoryIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        )}
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
                          {highlightMatch(getLocalizedName(option), searchQuery)}
                        </Typography>
                      </Box>
                    </li>
                  )}
                  sx={{ 
                    flex: 1,
                    '& .MuiAutocomplete-endAdornment': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      position: 'absolute',
                      right: '9px',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    },
                    '& .MuiAutocomplete-clearIndicator': {
                      visibility: searchQuery ? 'visible' : 'hidden',
                      padding: '2px',
                      color: 'action.active',
                      '&:hover': {
                        color: 'action.active',
                        backgroundColor: 'action.hover'
                      }
                    },
                    '& .MuiAutocomplete-clearIndicator svg': {
                      fontSize: '18px',
                      display: 'block'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <LocationInput
                  value={advancedSearch.location}
                  onChange={(newValue) => {
                    handleLocationChange(newValue);
                  }}
                  label={t('search.location')}
                  placeholder={t('search.location')}
                  fullWidth
                  width="100%"
                  sx={textFieldStyles}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={t('search.priceRange')}
                  label={t('search.priceRange')}
                  value={advancedSearch.priceRange}
                  onChange={(e) => setAdvancedSearch({ 
                    ...advancedSearch, 
                    priceRange: e.target.value 
                  })}
                  InputProps={{
                    'aria-label': t('search.priceRange')
                  }}
                  sx={textFieldStyles}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={t('search.availability')}
                  label={t('search.availability')}
                  value={advancedSearch.availability}
                  onChange={(e) => setAdvancedSearch({ 
                    ...advancedSearch, 
                    availability: e.target.value 
                  })}
                  InputProps={{
                    'aria-label': t('search.availability')
                  }}
                  sx={textFieldStyles}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions 
          sx={{ 
            gap: 2,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Button 
            onClick={handleClearAdvanced}
            startIcon={<ClearIcon />}
            aria-label={t('search.clearForm')}
            sx={{
              ...buttonStyles,
            }}
          >
            {t('common.clear')}
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button 
            onClick={() => setOpenAdvanced(false)}
            aria-label={t('common.close')}
            sx={{
              ...buttonStyles,
            }}
          >
            {t('common.close')}
          </Button>
          <Button 
            onClick={handleAdvancedSearch}
            startIcon={<SearchIcon />}
            aria-label={t('search.performAdvancedSearch')}
            sx={{
              ...buttonStyles,
            }}
          >
            {t('search.search')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 