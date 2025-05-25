import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, CircularProgress, Alert, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../contexts/AccessibilityContext';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const API_BASE_URL = 'http://localhost:3001/api';

interface ApiPrediction {
  description?: string;
  place_id?: string;
  [key: string]: string | number | boolean | undefined;
}

interface PlacePrediction {
  description: string;
  place_id: string;
}

interface AddressComponents {
  street: string;
  city: string;
  postalCode: string;
  province: string;
  country: string;
}

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  variant?: 'outlined' | 'standard' | 'filled';
  error?: boolean;
  helperText?: string;
  width?: string | number;
  sx?: object;
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  label = 'Location',
  placeholder = 'Enter a location',
  fullWidth = true,
  required = false,
  disabled = false,
  variant = 'outlined',
  error = false,
  helperText = '',
  width,
  sx = {},
}) => {
  const { t } = useTranslation();
  const { announceMessage } = useAccessibility();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<PlacePrediction[]>([]);
  const [inputValue, setInputValue] = useState(value);
  const [apiError, setApiError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Fetch location predictions when input changes
  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions([]);
      setApiError(null);
      return;
    }

    if (inputValue.length < 2) {
      return;
    }

    const fetchPredictions = async () => {
      setLoading(true);
      setApiError(null);
      try {
        console.log(`Fetching locations for: "${inputValue}"`);
        const response = await fetch(
          `${API_BASE_URL}/locations/autocomplete?input=${encodeURIComponent(inputValue)}&types=(cities)`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch location suggestions: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Location API response:', data);
        
        if (active) {
          // Check if the API returned an error
          if (data.error) {
            setApiError(data.error);
            setOptions([]);
            announceMessage(t('location.apiError', 'API Error: {{message}}', { message: data.error }));
            return;
          }
          
          if (data.predictions && data.predictions.length > 0) {
            // Make sure the predictions have the correct format
            const formattedPredictions = data.predictions.map((prediction: ApiPrediction) => ({
              description: prediction.description || '',
              place_id: prediction.place_id || `id-${Math.random()}`
            }));
            
            console.log('Setting options with:', formattedPredictions);
            setOptions(formattedPredictions);
            announceMessage(t('location.suggestionsFound', 'Found {{count}} location suggestions', { count: formattedPredictions.length }));
          } else {
            setOptions([]);
            announceMessage(t('location.noSuggestions', 'No location suggestions found'));
          }
        }
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
        if (active) {
          setOptions([]);
          setApiError((error as Error).message || 'Error fetching location suggestions');
          announceMessage(t('location.error', 'Error fetching location suggestions'));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchPredictions, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [inputValue, announceMessage, t]);

  // Update value when props change
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const getPositionWithRetry = async (retries = 3): Promise<GeolocationPosition> => {
    let lastError: GeolocationPositionError | null = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          // First try getting a single position
          const getCurrentPositionPromise = new Promise<GeolocationPosition>((resolvePos, rejectPos) => {
            navigator.geolocation.getCurrentPosition(
              resolvePos,
              rejectPos,
              {
                enableHighAccuracy: false, // Try low accuracy first for faster response
                timeout: 5000,
                maximumAge: 30000 // Allow cached positions up to 30 seconds old
              }
            );
          });

          // If that fails, try watching position with high accuracy
          const watchPositionPromise = new Promise<GeolocationPosition>((resolveWatch, rejectWatch) => {
            const watchId = navigator.geolocation.watchPosition(
              (pos) => {
                if (pos.coords.accuracy <= 100) {
                  navigator.geolocation.clearWatch(watchId);
                  resolveWatch(pos);
                }
              },
              (error) => {
                navigator.geolocation.clearWatch(watchId);
                rejectWatch(error);
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
              }
            );

            // Clear watch after timeout
            setTimeout(() => {
              navigator.geolocation.clearWatch(watchId);
              rejectWatch(new GeolocationPositionError());
            }, 10000);
          });

          // Try both methods
          Promise.race([getCurrentPositionPromise, watchPositionPromise])
            .then(resolve)
            .catch(reject);

          // Cleanup after timeout
          setTimeout(() => {
            reject(new GeolocationPositionError());
          }, 15000);
        });
        
        return position;
      } catch (error) {
        lastError = error instanceof GeolocationPositionError ? error : null;
        
        if (error instanceof GeolocationPositionError) {
          const isMacLocationUnknown = error.message && error.message.includes('kCLErrorLocationUnknown');
          
          if ((error.code === error.POSITION_UNAVAILABLE || isMacLocationUnknown) && attempt < retries) {
            const waitTime = Math.min(attempt * 3000, 10000); // Increase wait time but cap at 10 seconds
            announceMessage(t('location.retrying', 'Location unavailable, retrying... (Attempt {{attempt}} of {{total}})', {
              attempt: attempt + 1,
              total: retries
            }));
            
            // If it's a macOS location unknown error, suggest moving to a better location
            if (isMacLocationUnknown && attempt === 1) {
              announceMessage(t('location.macOSHint', 'Try moving to a location with better GPS signal'));
            }
            
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }
        
        if (attempt === retries) {
          throw lastError || new Error('Failed to get position after retries');
        }
      }
    }
    
    throw lastError || new Error('Failed to get position after retries');
  };

  const parseAddressComponents = (data: any): AddressComponents | null => {
    try {
      const address = data.address || {};
      const components: AddressComponents = {
        street: '',
        city: '',
        postalCode: '',
        province: '',
        country: ''
      };

      // Handle different address formats
      if (address.road) {
        components.street = `${address.house_number || ''} ${address.road}`.trim();
      } else if (address.pedestrian) {
        components.street = address.pedestrian;
      }

      // Handle city/town/village
      components.city = address.city || address.town || address.village || '';

      // Handle postal code
      components.postalCode = address.postcode || '';

      // Handle province/state
      components.province = address.state || address.province || '';

      // Handle country
      components.country = address.country || '';

      return components;
    } catch (error) {
      console.error('Error parsing address components:', error);
      return null;
    }
  };

  const formatAddress = (components: AddressComponents): string => {
    const parts = [];

    if (components.street) parts.push(components.street);
    if (components.city) parts.push(components.city);
    if (components.province) parts.push(components.province);
    if (components.postalCode) parts.push(components.postalCode);
    if (components.country) parts.push(components.country);

    return parts.join(', ');
  };

  const handleGpsLocation = async () => {
    if (!navigator.geolocation) {
      setApiError(t('location.gpsNotSupported', 'GPS is not supported by your browser'));
      announceMessage(t('location.gpsNotSupported', 'GPS is not supported by your browser'));
      return;
    }

    setGpsLoading(true);
    setApiError(null);
    
    try {
      const position = await getPositionWithRetry(3);
      const { latitude, longitude } = position.coords;
      
      // Log accuracy for debugging
      console.log('Location accuracy:', position.coords.accuracy, 'meters');
      
      // Reverse geocode the coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lng=${longitude}&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.details || data.error);
      }

      const addressComponents = parseAddressComponents(data);
      
      if (addressComponents) {
        const formattedAddress = formatAddress(addressComponents);
        onChange(formattedAddress);
        setInputValue(formattedAddress);
        announceMessage(t('location.gpsSuccess', 'Location found: {{address}}', { address: formattedAddress }));
      } else {
        throw new Error('No address found in response');
      }
    } catch (error) {
      console.error('GPS location error:', error);
      
      let errorMessage: string;
      if (error instanceof GeolocationPositionError) {
        const isMacLocationUnknown = error.message && error.message.includes('kCLErrorLocationUnknown');
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t('location.gpsPermissionDenied', 'Location permission was denied. Please enable location access in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = isMacLocationUnknown 
              ? t('location.macOSLocationUnknown', 'Could not determine your location. Try moving to a location with better GPS signal or enable Wi-Fi for better accuracy.')
              : t('location.gpsUnavailable', 'Could not determine your location. Please ensure you have a clear view of the sky or try again in a different location.');
            break;
          case error.TIMEOUT:
            errorMessage = t('location.gpsTimeout', 'Location request timed out. Please check your GPS signal and try again.');
            break;
          default:
            errorMessage = t('location.gpsError', 'Could not get your location. Please check your GPS permissions.');
        }
      } else {
        errorMessage = t('location.gpsAddressError', 'Could not get address from your location. Please try again or enter your location manually.');
      }
      
      setApiError(errorMessage);
      announceMessage(errorMessage);
    } finally {
      setGpsLoading(false);
    }
  };

  return (
    <>
      <Autocomplete
        id="location-autocomplete"
        options={options}
        getOptionLabel={(option) => typeof option === 'string' ? option : option.description}
        filterOptions={(x) => x}
        freeSolo
        includeInputInList
        filterSelectedOptions
        value={value}
        inputValue={inputValue}
        loading={loading}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            onChange(newValue);
          } else if (newValue && 'description' in newValue) {
            onChange(newValue.description);
            announceMessage(t('location.selected', 'Selected location: {{location}}', { location: newValue.description }));
          } else {
            onChange('');
          }
        }}
        sx={{
          width: width || (fullWidth ? '100%' : 'auto'),
          ...sx,
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
            opacity: inputValue ? 1 : 0,
            visibility: inputValue ? 'visible' : 'hidden',
            padding: '2px',
            marginRight: '4px',
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
        renderOption={(props, option) => (
          <li {...props} key={option.place_id || 'fallback-key'}>
            <div style={{ padding: '8px 4px' }}>
              {typeof option === 'string' ? option : option.description}
            </div>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            fullWidth={fullWidth}
            required={required}
            disabled={disabled}
            variant={variant}
            error={error || !!apiError}
            helperText={apiError ? '' : helperText}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  <Tooltip title={t('location.useGps', 'Use my location')}>
                    <IconButton
                      onClick={handleGpsLocation}
                      disabled={gpsLoading || disabled}
                      size="small"
                      sx={{ 
                        padding: '2px',
                        color: 'action.active',
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: 'action.hover'
                        }
                      }}
                      aria-label={t('location.useGps', 'Use my location')}
                    >
                      {gpsLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <MyLocationIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        noOptionsText={apiError ? '' : t('location.noOptions', 'No locations found')}
        loadingText={t('location.loading', 'Loading locations...')}
      />
      {apiError && (
        <Alert 
          severity="error" 
          sx={{ mt: 1 }}
          slotProps={{
            root: {
              'aria-label': apiError
            }
          }}
        >
          {apiError}
        </Alert>
      )}
    </>
  );
};

export default LocationInput; 