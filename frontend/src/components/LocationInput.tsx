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
        `${API_BASE_URL}/locations/reverse-geocode?lat=${latitude}&lng=${longitude}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.details || data.error);
      }

      if (data.address) {
        onChange(data.address);
        setInputValue(data.address);
        announceMessage(t('location.gpsSuccess', 'Location found: {{address}}', { address: data.address }));
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
        freeSolo
        value={value}
        inputValue={inputValue}
        onChange={(_, newValue) => {
          onChange(newValue || '');
        }}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={options}
        getOptionLabel={(option) => 
          typeof option === 'string' ? option : option.description
        }
        loading={loading}
        fullWidth={fullWidth}
        disabled={disabled}
        clearIcon={inputValue ? undefined : null}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            required={required}
            variant={variant}
            error={error || !!apiError}
            helperText={helperText || apiError}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                  <Tooltip title={t('location.useCurrentLocation', 'Use current location')}>
                    <IconButton
                      onClick={handleGpsLocation}
                      disabled={gpsLoading || disabled}
                      size="small"
                      sx={{ ml: 0.5 }}
                    >
                      <MyLocationIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              ),
            }}
          />
        )}
        sx={{
          width: width || (fullWidth ? '100%' : 'auto'),
          ...sx,
        }}
      />
      {apiError && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {apiError}
        </Alert>
      )}
    </>
  );
};

export default LocationInput; 