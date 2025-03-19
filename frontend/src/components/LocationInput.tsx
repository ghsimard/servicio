import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, CircularProgress, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../contexts/AccessibilityContext';

const API_BASE_URL = 'http://localhost:3006/api';

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

  return (
    <>
      <Autocomplete
        id="location-autocomplete"
        options={options}
        getOptionLabel={(option) => typeof option === 'string' ? option : option.description}
        filterOptions={(x) => x} // Don't filter options, API does that
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
            console.log('Selected string value:', newValue);
          } else if (newValue && 'description' in newValue) {
            onChange(newValue.description);
            console.log('Selected object value:', newValue.description);
            announceMessage(t('location.selected', 'Selected location: {{location}}', { location: newValue.description }));
          } else {
            onChange('');
            console.log('Cleared value');
          }
        }}
        sx={{ width: width || '100%', ...sx }}
        renderOption={(props, option) => {
          // Add more detailed logging to debug option display
          console.log('Rendering option:', option);
          return (
            <li {...props} key={option.place_id || 'fallback-key'}>
              <div style={{ padding: '8px 4px' }}>
                {typeof option === 'string' ? option : option.description}
              </div>
            </li>
          );
        }}
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
        <Alert severity="error" sx={{ mt: 1 }}>
          {apiError}
        </Alert>
      )}
    </>
  );
};

export default LocationInput; 