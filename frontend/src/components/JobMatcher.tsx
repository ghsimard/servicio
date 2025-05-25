import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Button, CircularProgress, TextField } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Update Google Maps type definitions
declare namespace google.maps {
  interface Geocoder {}
  interface GeocoderResult {}
  interface DistanceMatrixService {
    getDistanceMatrix(
      request: {
        origins: Array<{ lat: number; lng: number }>;
        destinations: Array<{ lat: number; lng: number }>;
        travelMode: TravelMode;
        unitSystem: UnitSystem;
      },
      callback: (response: any, status: string) => void
    ): void;
  }
  interface TravelMode {}
  interface UnitSystem {}
  interface MapsEventListener {}
  
  namespace places {
    interface PlacesService {}
    interface PlaceResult {
      formatted_address?: string;
      geometry?: {
        location: {
          lat(): number;
          lng(): number;
        };
      };
      name?: string;
    }
    interface AutocompleteOptions {
      types?: string[];
      componentRestrictions?: { country: string };
      fields?: string[];
    }
    interface Autocomplete {
      getPlace(): PlaceResult;
      addListener(event: string, callback: () => void): MapsEventListener;
    }
  }
}

interface Category {
  name: string;
  confidence: number;
}

interface Professional {
  id: string;
  name: string;
  category: string;
  rating: number;
  experience: string;
  specialties?: string;
  address: string;
  source: 'mock';
  latitude?: number;
  longitude?: number;
  distance?: number | null;
}

// Web Speech API TypeScript definitions
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  interpretation: unknown;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onend: ((this: SpeechRecognition) => void) | null;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
    google: {
      maps: {
        Geocoder: new () => google.maps.Geocoder;
        PlacesService: new (div: HTMLDivElement) => google.maps.places.PlacesService;
        GeocoderResult: google.maps.GeocoderResult;
        DistanceMatrixService: new () => google.maps.DistanceMatrixService;
        TravelMode: {
          DRIVING: google.maps.TravelMode;
          WALKING: google.maps.TravelMode;
          BICYCLING: google.maps.TravelMode;
          TRANSIT: google.maps.TravelMode;
        };
        UnitSystem: {
          METRIC: google.maps.UnitSystem;
          IMPERIAL: google.maps.UnitSystem;
        };
        places: {
          PlacesService: new (div: HTMLDivElement) => google.maps.places.PlacesService;
          PlaceResult: google.maps.places.PlaceResult;
          Autocomplete: new (input: HTMLInputElement, options?: google.maps.places.AutocompleteOptions) => google.maps.places.Autocomplete;
        };
        event: {
          removeListener: (listener: any) => void;
        };
      };
    };
  }
}

interface CategoryResponse {
  name: string;
  confidence: number;
}

// Add interface for address components
interface AddressComponents {
  street: string;
  city: string;
  postalCode: string;
  province: string;
  country: string;
}

// Add function to parse address components
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

// Add function to format address
const formatAddress = (components: AddressComponents): string => {
  const parts = [];

  if (components.street) parts.push(components.street);
  if (components.city) parts.push(components.city);
  if (components.province) parts.push(components.province);
  if (components.postalCode) parts.push(components.postalCode);
  if (components.country) parts.push(components.country);

  return parts.join(', ');
};

const analyzeJobWithGrok = async (description: string): Promise<[Category[] | null, string | null]> => {
  try {
    const response = await axios.post('https://api.x.ai/v1/chat/completions', {
      messages: [
        {
          role: "system",
          content: `You are a job analyzer. Given a user's job description, respond with ONLY a JSON object and nothing else. The JSON must be in this exact format: {"matches": [{"name": "JobTypeOrTrade", "confidence": 0.85}]}. 
"name" should be the most appropriate trade, profession, or type of helper needed to accomplish the user's request (e.g., Plumber, Electrician, Painter, Cleaner, General Contractor, Handyman, etc.).
"confidence" must be a number between 0 and 1, reflecting how well the job type matches the user's description.
If the job description contains an exact match to a trade or helper's keyword, set confidence to 1.0 (100%).
For a perfect match, use 0.95–1.0. For a good match, use 0.7–0.9. For a partial match, use 0.5–0.7. For a weak or unlikely match, use 0.3–0.5.
Do not include any explanations, markdown, or additional text.
Infer the best job type(s) or trade(s) from the job description alone.`
        },
        {
          role: "user",
          content: `Return a JSON object with matches for this job: "${description}"`
        }
      ],
      model: "grok-2-latest",
      stream: false,
      temperature: 0
    }, {
      headers: {
        'Authorization': 'Bearer xai-Po63wCzRhWjQrVZfonpFB2IPuOLbBxORD26aMB5vipuP1vASybUbpr2SSsuiDtEoZpaCzEKG9n1zALwW',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.data.choices?.[0]?.message?.content) {
      console.error('Invalid response structure:', response.data);
      return [null, 'Invalid response structure from Grok API'];
    }

    let content = response.data.choices[0].message.content.trim();
    console.log('Raw API response:', content);
    
    // Remove any non-JSON content
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('No JSON object found in response:', content);
      return [null, 'Invalid response format: no JSON object found'];
    }
    
    content = content.slice(jsonStart, jsonEnd + 1);
    console.log('Extracted JSON:', content);
    
    try {
      // Try to clean the JSON string before parsing
      content = content.replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Remove control characters
      content = content.replace(/\n/g, ' ').replace(/\r/g, ' '); // Remove newlines
      content = content.replace(/\s+/g, ' ').trim(); // Normalize whitespace
      
      // Fix malformed JSON with extra braces
      let openBraces = 0;
      let closeBraces = 0;
      let fixedContent = '';
      
      for (let i = 0; i < content.length; i++) {
        if (content[i] === '{') {
          openBraces++;
          fixedContent += content[i];
        } else if (content[i] === '}') {
          closeBraces++;
          if (closeBraces <= openBraces) {
            fixedContent += content[i];
          }
        } else {
          fixedContent += content[i];
        }
      }
      
      content = fixedContent;
      console.log('Fixed JSON:', content);
      
      const result = JSON.parse(content);
      console.log('Parsed result:', result);
      
      if (!result.matches || !Array.isArray(result.matches)) {
        console.error('Invalid matches format:', result);
        return [null, 'Invalid response format: missing matches array'];
      }

      const validMatches = result.matches
        .filter((cat: CategoryResponse) => {
          const isValid = 
            cat?.name && 
            typeof cat.name === 'string' && 
            typeof cat.confidence === 'number' && 
            cat.confidence >= 0 && 
            cat.confidence <= 1;
          
          if (!isValid) {
            console.warn('Invalid match:', cat);
          }
          return isValid;
        })
        .map((cat: CategoryResponse) => ({
          name: cat.name.trim(),
          confidence: Math.min(Math.max(cat.confidence, 0), 1)
        }));

      if (validMatches.length === 0) {
        console.error('No valid matches found:', result.matches);
        return [null, 'No valid matches found in response'];
      }

      console.log('Final matches:', validMatches);
      return [validMatches, null];
    } catch (error) {
      console.error('JSON Parse Error:', error);
      console.error('Content that failed to parse:', content);
      return [null, error instanceof Error ? `Failed to parse response: ${error.message}` : 'Failed to parse response'];
    }
  } catch (error) {
    console.error('API Error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      return [null, `API Error: ${error.response?.data?.error || error.message}`];
    }
    return [null, 'An unexpected error occurred'];
  }
};

// Mock professionals data
const mockProfessionals: Record<string, Professional[]> = {
  'Plumber': [
    { 
      id: '1', 
      name: 'John Smith', 
      category: 'Plumber', 
      rating: 4.8, 
      experience: '10 years',
      address: '123 Bank Street, Ottawa, ON K1P 5M7',
      latitude: 45.4149132,
      longitude: -75.6935412,
      source: 'mock'
    },
    { 
      id: '2', 
      name: 'Charlotte Piper', 
      category: 'Plumber', 
      rating: 4.5, 
      experience: '8 years',
      address: '456 Elgin Street, Ottawa, ON K2P 1L7',
      latitude: 45.4149646,
      longitude: -75.6883932,
      source: 'mock'
    },
    { 
      id: '11', 
      name: 'Roger Massia', 
      category: 'Plumber', 
      rating: 4.7, 
      experience: '12 years',
      address: '130 Yates Street, Otter Lake, QC J0X 2P0',
      latitude: 45.9602455,
      longitude: -76.5058308,
      source: 'mock'
    },
    { 
      id: '12', 
      name: 'Marie-Claude Roy', 
      category: 'Plumber', 
      rating: 4.6, 
      experience: '9 years',
      address: '45 Lake Road, Otter Lake, QC J0X 2P0',
      latitude: 45.9630032,
      longitude: -76.5079646,
      source: 'mock'
    },
  ],
  'Electrician': [
    { 
      id: '3', 
      name: 'Ghislain Simard', 
      category: 'Electrician', 
      rating: 4.9, 
      experience: '15 years', 
      specialties: 'Ceiling Fans, Home Wiring, Switch fixing Magician',
      address: '789 Rideau Street, Ottawa, ON K1N 5W1',
      latitude: 45.4292996,
      longitude: -75.6839322,
      source: 'mock'
    },
    { 
      id: '4', 
      name: 'Tom Brown', 
      category: 'Electrician', 
      rating: 4.7, 
      experience: '12 years', 
      specialties: 'Electrical Repairs, Installations',
      address: '321 Sussex Drive, Ottawa, ON K1N 5T1',
      latitude: 45.4342092,
      longitude: -75.6988576,
      source: 'mock'
    },
    { 
      id: '5', 
      name: 'Alex Rivera', 
      category: 'Electrician', 
      rating: 4.8, 
      experience: '10 years', 
      specialties: 'Fans, Lighting, Power Systems',
      address: '654 Wellington Street, Ottawa, ON K1Y 3B1',
      latitude: 45.4110172,
      longitude: -75.7138886,
      source: 'mock'
    },
    { 
      id: '13', 
      name: 'Jean-François Bouchard', 
      category: 'Electrician', 
      rating: 4.8, 
      experience: '11 years', 
      specialties: 'Rural Electrical Systems, Solar Installations',
      address: '78 Forest Lane, Otter Lake, QC J0X 2P0',
      latitude: 45.9630032,
      longitude: -76.5079646,
      source: 'mock'
    },
  ],
  'Painter': [
    { 
      id: '6', 
      name: 'David Lee', 
      category: 'Painter', 
      rating: 4.6, 
      experience: '7 years',
      address: '987 Somerset Street, Ottawa, ON K1R 5R9',
      latitude: 45.4093772,
      longitude: -75.7130132,
      source: 'mock'
    },
    { 
      id: '14', 
      name: 'Sophie Leblanc', 
      category: 'Painter', 
      rating: 4.7, 
      experience: '8 years',
      address: '92 Pine Street, Otter Lake, QC J0X 2P0',
      latitude: 45.9630032,
      longitude: -76.5079646,
      source: 'mock'
    },
  ],
  'Cleaner': [
    { 
      id: '7', 
      name: 'Maria Garcia', 
      category: 'Cleaner', 
      rating: 4.8, 
      experience: '5 years',
      address: '741 Preston Street, Ottawa, ON K1R 7N9',
      latitude: 45.4042322,
      longitude: -75.7139642,
      source: 'mock'
    },
    { 
      id: '15', 
      name: 'Isabelle Tremblay', 
      category: 'Cleaner', 
      rating: 4.9, 
      experience: '6 years',
      address: '130 Yates Street, Otter Lake, QC J0X 2P0',
      latitude: 45.9602455,
      longitude: -76.5058308,
      source: 'mock'
    },
  ],
  'General Contractor': [
    { 
      id: '8', 
      name: 'Bob Wilson', 
      category: 'General Contractor', 
      rating: 4.7, 
      experience: '20 years',
      address: '852 Carling Avenue, Ottawa, ON K1Y 4J7',
      latitude: 45.3984382,
      longitude: -75.7226642,
      source: 'mock'
    },
    { 
      id: '16', 
      name: 'Marc-André Gagnon', 
      category: 'General Contractor', 
      rating: 4.8, 
      experience: '15 years',
      address: '55 Lakeshore Drive, Otter Lake, QC J0X 2P0',
      latitude: 45.9630032,
      longitude: -76.5079646,
      source: 'mock'
    },
  ],
  'Handyman': [
    { 
      id: '9', 
      name: 'Joseph Maalouf', 
      category: 'Handyman', 
      rating: 4.5, 
      experience: '-23,4 years', 
      specialties: 'General Repairs, Installations, Better to be a Needer',
      address: '159 Bronson Avenue, Ottawa, ON K1R 6J7',
      latitude: 45.4102322,
      longitude: -75.7069642,
      source: 'mock'
    },
    { 
      id: '10', 
      name: 'Carlos Mendez', 
      category: 'Handyman', 
      rating: 4.6, 
      experience: '8 years', 
      specialties: 'Fans, Furniture Assembly',
      address: '357 Gladstone Avenue, Ottawa, ON K2P 0Y9',
      latitude: 45.4122322,
      longitude: -75.7019642,
      source: 'mock'
    },
    { 
      id: '17', 
      name: 'Raymond  Massia', 
      category: 'Handyman', 
      rating: 4.7, 
      experience: '10 years', 
      specialties: 'Cottage Repairs, Winter Maintenance',
      address: '110 Yates Street, Otter Lake, QC J0X 2P0',
      latitude: 45.9602455,
      longitude: -76.5058308,
      source: 'mock'
    },
  ],
};

// Add new interfaces for Google Places
interface GooglePlace {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  vicinity: string;
  formatted_address: string;
  types: string[];
  opening_hours?: {
    open_now: boolean;
  };
  photos?: Array<{
    photo_reference: string;
  }>;
}

interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  rating: number;
  experience: string;
  specialties?: string;
  address: string;
  source: 'mock' | 'google';
  place_id?: string;
  user_ratings_total?: number;
  is_open_now?: boolean;
  photo_url?: string;
}

// Add function to format location for geocoding
const formatLocationForGeocoding = (location: string): string => {
  // Add country if not specified
  if (!location.toLowerCase().includes('canada')) {
    location = `${location}, Canada`;
  }
  return location;
};

// Remove all Google Maps related code
interface Professional {
  id: string;
  name: string;
  category: string;
  rating: number;
  experience: string;
  specialties?: string;
  address: string;
  source: 'mock';
  latitude?: number;
  longitude?: number;
}

// Keep only the necessary utility functions
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const formatDistance = (distance: number | null | undefined): string => {
  console.log('Formatting distance:', distance);
  if (distance === null || distance === undefined) {
    console.log('Distance is null or undefined');
    return 'Distance not available';
  }
  if (isNaN(distance)) {
    console.log('Distance is NaN');
    return 'Invalid distance';
  }
  if (distance < 1) {
    const meters = Math.round(distance * 1000);
    console.log('Distance in meters:', meters);
    return `${meters}m`;
  }
  const km = distance.toFixed(1);
  console.log('Distance in kilometers:', km);
  return `${km}km`;
};

// Update debounce utility to fix Timeout type
const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Update getCoordinatesFromLocation to better handle postal codes
const getCoordinatesFromLocation = async (location: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    console.log('=== START: Getting coordinates ===');
    console.log('Input location:', location);
    
    // Format the location for better postal code handling
    const formattedLocation = location.includes(',') ? location : `${location}, Canada`;
    console.log('Formatted location for API:', formattedLocation);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formattedLocation)}&limit=1&addressdetails=1`
    );
    const data = await response.json();
    console.log('Nominatim API response:', data);
    
    if (data && data.length > 0) {
      const coords = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
      console.log('Successfully parsed coordinates:', coords);
      console.log('=== END: Getting coordinates ===');
      return coords;
    }
    
    console.log('No coordinates found in response');
    console.log('=== END: Getting coordinates ===');
    return null;
  } catch (error) {
    console.error('Error in getCoordinatesFromLocation:', error);
    console.log('=== END: Getting coordinates (with error) ===');
    return null;
  }
};

// Add Google Maps Distance Matrix types
interface DistanceMatrixResponse {
  status: string;
  rows: Array<{
    elements: Array<{
      status: string;
      distance?: {
        value: number;
        text: string;
      };
      duration?: {
        value: number;
        text: string;
      };
    }>;
  }>;
}

// Add a function to check if Google Maps is loaded
const isGoogleMapsLoaded = (): boolean => {
  return typeof window !== 'undefined' && 
         window.google !== undefined && 
         window.google.maps !== undefined;
};

// Add a function to check Google Maps API loading status
const checkGoogleMapsAPI = () => {
  console.log('=== Checking Google Maps API ===');
  console.log('window.google exists:', !!window.google);
  if (window.google) {
    console.log('window.google.maps exists:', !!window.google.maps);
    if (window.google.maps) {
      console.log('DistanceMatrixService exists:', !!window.google.maps.DistanceMatrixService);
      console.log('TravelMode exists:', !!window.google.maps.TravelMode);
      console.log('UnitSystem exists:', !!window.google.maps.UnitSystem);
    }
  }
  console.log('=== End Google Maps API Check ===');
};

// Update the distance calculation with more logging
const calculateDistanceWithGoogle = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<number | null> => {
  try {
    console.log('=== Distance Calculation ===');
    console.log('Origin:', origin);
    console.log('Destination:', destination);

    // Check Google Maps API status
    checkGoogleMapsAPI();

    // Fallback to Haversine formula if Google Maps is not available
    if (!isGoogleMapsLoaded()) {
      console.log('Google Maps not loaded, using Haversine formula');
      return calculateHaversineDistance(origin, destination);
    }

    console.log('Using Google Distance Matrix API');
    const service = new window.google.maps.DistanceMatrixService();
    console.log('DistanceMatrixService created:', !!service);
    
    return new Promise((resolve, reject) => {
      const request = {
        origins: [{ lat: origin.lat, lng: origin.lng }],
        destinations: [{ lat: destination.lat, lng: destination.lng }],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC
      };
      console.log('Distance Matrix request:', request);

      service.getDistanceMatrix(
        request,
        (response: any, status: string) => {
          console.log('Google Distance Matrix response:', response);
          console.log('Status:', status);

          if (status === 'OK' && response) {
            const distance = response.rows[0].elements[0].distance.value / 1000; // Convert meters to kilometers
            console.log('Google distance (km):', distance);
            resolve(distance);
          } else {
            console.error('Error getting distance:', status);
            // Fallback to Haversine if Google fails
            const distance = calculateHaversineDistance(origin, destination);
            console.log('Fallback Haversine distance (km):', distance);
            resolve(distance);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in distance calculation:', error);
    // Final fallback to Haversine
    try {
      const distance = calculateHaversineDistance(origin, destination);
      console.log('Emergency fallback distance (km):', distance);
      return distance;
    } catch (fallbackError) {
      console.error('Fallback calculation failed:', fallbackError);
      return null;
    }
  }
};

// Add a helper function for Haversine calculation
const calculateHaversineDistance = (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (destination.lat - origin.lat) * Math.PI / 180;
  const dLon = (destination.lng - origin.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Update sortByDistance function with proper types
function sortByDistance(a: { distance?: number | null }, b: { distance?: number | null }): number {
  const da = (typeof a.distance === 'number' && !isNaN(a.distance)) ? a.distance : Infinity;
  const db = (typeof b.distance === 'number' && !isNaN(b.distance)) ? b.distance : Infinity;
  return da - db;
}

// Helper to load Google Maps JS API with Places library
function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps && window.google.maps.places) {
      resolve();
      return;
    }
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

// Add this near the top of the component, after the imports
const styles = {
  hideGoogleLogo: {
    '& .pac-container': {
      '& .pac-logo': {
        display: 'none !important',
      },
      '&::after': {
        display: 'none !important',
      }
    }
  }
};

export default function JobMatcher() {
  const [jobDescription, setJobDescription] = useState('');
  const [location, setLocation] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [needsLocation, setNeedsLocation] = useState(false);
  const [isLocationListening, setIsLocationListening] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [searchRadius, setSearchRadius] = useState(5);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const shouldRestartRecognitionRef = useRef(false);
  const isLocationListeningRef = useRef(isLocationListening);
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const autocompleteRef = useRef<any>(null);

  // Keep the ref in sync with the state
  useEffect(() => {
    isLocationListeningRef.current = isLocationListening;
  }, [isLocationListening]);

  // Initialize speech synthesis
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  // Update handleLocationChange to store user coordinates
  const handleLocationChange = async (newLocation: string) => {
    console.log('=== START: handleLocationChange ===');
    console.log('New location:', newLocation);
    
    setLocation(newLocation);
    if (selectedCategory && newLocation.trim()) {
      console.log('Selected category:', selectedCategory);
      
      try {
        const coordinates = await getCoordinatesFromLocation(newLocation);
        console.log('User coordinates:', coordinates);
        setUserCoordinates(coordinates);
        
        if (!coordinates) {
          console.error('Failed to get coordinates for location:', newLocation);
          return;
        }
        
        const mockResults = mockProfessionals[selectedCategory] || [];
        console.log('Found mock professionals:', mockResults.length);
        
        const professionalsWithDistance = mockResults
          .map(p => {
            let distance = null;
            if (p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)) {
              distance = calculateHaversineDistance(
                coordinates,
                { lat: p.latitude, lng: p.longitude }
              );
              console.log(`Distance for ${p.name}:`, distance, typeof distance);
            }
            return { ...p, source: 'mock' as const, distance };
          })
          .filter(p => {
            console.log('Filtering:', p.name, p.distance, typeof p.distance, searchRadius);
            return p.distance !== null && p.distance <= searchRadius;
          });
        
        // Always sort by distance before setting
        professionalsWithDistance.sort(sortByDistance);
        console.log('Filtered professionals within radius:', professionalsWithDistance);
        setProfessionals(professionalsWithDistance);
      } catch (error) {
        console.error('Error in handleLocationChange:', error);
      }
    }
    console.log('=== END: handleLocationChange ===');
  };

  // Add function to increase search radius
  const increaseSearchRadius = () => {
    const newRadius = searchRadius + 5;
    setSearchRadius(newRadius);
    // Do NOT call handleLocationChange here; let useEffect handle it
  };

  // Add useEffect to trigger search when searchRadius, location, or selectedCategory changes
  useEffect(() => {
    if (location.trim() && selectedCategory) {
      handleLocationChange(location);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchRadius]);

  // Update handleCategorySelect to filter by distance
  const handleCategorySelect = async (category: string) => {
    console.log('=== START: handleCategorySelect ===');
    console.log('Selected category:', category);
    
    setSelectedCategory(category);
    const mockResults = mockProfessionals[category] || [];
    
    // If we have a location, calculate distances and filter
    if (location.trim()) {
      try {
        const coordinates = await getCoordinatesFromLocation(location);
        console.log('User coordinates:', coordinates);
        
        if (coordinates) {
          const professionalsWithDistance = mockResults
            .map(p => {
              let distance = null;
              if (p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)) {
                distance = calculateHaversineDistance(
                  coordinates,
                  { lat: p.latitude, lng: p.longitude }
                );
                console.log(`Distance for ${p.name}:`, distance, typeof distance);
              }
              return { ...p, source: 'mock' as const, distance };
            })
            .filter(p => {
              console.log('Filtering:', p.name, p.distance, typeof p.distance, searchRadius);
              return p.distance !== null && p.distance <= searchRadius;
            });
          
          // Always sort by distance before setting
          professionalsWithDistance.sort(sortByDistance);
          console.log('Filtered professionals within radius:', professionalsWithDistance);
          setProfessionals(professionalsWithDistance);
        } else {
          setProfessionals([]);
        }
      } catch (error) {
        console.error('Error calculating distances:', error);
        setProfessionals([]);
      }
    } else {
      setProfessionals([]);
    }
    console.log('=== END: handleCategorySelect ===');
  };

  // Update analyzeJob to filter by distance
  const analyzeJob = async () => {
    setSearchRadius(5);
    if (!jobDescription.trim()) return;

    setIsLoading(true);
    setError(null);
    setCategories([]);
    setSelectedCategory('');
    setProfessionals([]);

    try {
      const [categories, error] = await analyzeJobWithGrok(jobDescription);
      
      if (error) {
        setError(error);
        return;
      }

      if (categories) {
        setCategories(categories);
        if (categories.length > 0) {
          const selectedCategory = categories[0].name;
          setSelectedCategory(selectedCategory);
          
          // Get mock results and calculate distances if location exists
          const mockResults = mockProfessionals[selectedCategory] || [];
          if (location.trim()) {
            try {
              const coordinates = await getCoordinatesFromLocation(location);
              if (coordinates) {
                const professionalsWithDistance = mockResults
                  .map(p => {
                    let distance = null;
                    if (p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)) {
                      distance = calculateHaversineDistance(
                        coordinates,
                        { lat: p.latitude, lng: p.longitude }
                      );
                    }
                    return { ...p, source: 'mock' as const, distance };
                  })
                  .filter(p => p.distance !== null && p.distance <= 5);
                
                // Always sort by distance before setting
                professionalsWithDistance.sort(sortByDistance);
                console.log('Filtered professionals within 5km:', professionalsWithDistance);
                setProfessionals(professionalsWithDistance);
              } else {
                setProfessionals([]);
              }
            } catch (error) {
              console.error('Error calculating distances:', error);
              setProfessionals([]);
            }
          } else {
            setProfessionals([]);
          }
        }
      }

      // After successful analysis, check if location is needed
      if (!location.trim()) {
        setNeedsLocation(true);
        if (recognition) {
          recognition.stop();
          speak("For which location?");
          if (locationInputRef.current) {
            locationInputRef.current.focus();
          }
          shouldRestartRecognitionRef.current = true;
          setIsListening(false);
          setIsLocationListening(true);
        }
      }
    } catch (error) {
      console.error('Error in analyzeJob:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join(' ');
        
        if (isLocationListeningRef.current) {
          // Always write to the location field when listening for location
          const locationTranscript = transcript.trim();
          setLocation(locationTranscript);
          setIsLocationListening(false);
          if (locationInputRef.current) {
            locationInputRef.current.focus();
          }
          if (jobDescription.trim()) {
            analyzeJob();
          }
        } else {
          // Only update the job description if not in location listening mode
          setJobDescription(transcript.trim());
          if (!location.trim()) {
            setNeedsLocation(true);
            if (recognition) recognition.stop();
            speak("For which location?");
            if (locationInputRef.current) {
              locationInputRef.current.focus();
            }
            shouldRestartRecognitionRef.current = true;
            setIsListening(false);
            setIsLocationListening(true);
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsLocationListening(false);
        
        switch (event.error) {
          case 'not-allowed':
          case 'permission-denied':
            setMicPermissionError('Microphone access was denied. Please allow microphone access in your browser settings to use voice input.');
            break;
          case 'no-speech':
            setMicPermissionError('No speech was detected. Please try again.');
            break;
          case 'audio-capture':
            setMicPermissionError('No microphone was found. Please ensure you have a working microphone connected.');
            break;
          case 'network':
            setMicPermissionError('Network error occurred. Please check your internet connection.');
            break;
          default:
            setMicPermissionError('An error occurred with speech recognition. Please try typing instead.');
        }
      };

      recognition.onend = () => {
        if (isListening) {
          try {
            recognition.start();
          } catch (error) {
            console.error('Error restarting recognition:', error);
          }
        }
        // For location listening, handle robust restart
        if (shouldRestartRecognitionRef.current) {
          shouldRestartRecognitionRef.current = false;
          try {
            recognition.start();
            setIsListening(false);
            setIsLocationListening(true);
          } catch (error) {
            console.error('Error auto-restarting recognition for location:', error);
          }
        }
      };

      setRecognition(recognition);
    } else {
      setMicPermissionError('Speech recognition is not supported in your browser. Please use a modern browser like Chrome or Edge.');
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setMicPermissionError(null);
    } else {
      try {
        recognition.start();
        setIsListening(true);
        setMicPermissionError(null);
      } catch (error) {
        console.error('Error starting recognition:', error);
        setMicPermissionError('Failed to start speech recognition. Please try again.');
      }
    }
  };

  const toggleLocationListening = () => {
    if (!recognition) return;

    if (isLocationListening) {
      recognition.stop();
      setIsLocationListening(false);
    } else {
      try {
        recognition.start();
        setIsLocationListening(true);
        speak("For which location?");
      } catch (error) {
        console.error('Error starting location recognition:', error);
        setMicPermissionError('Failed to start speech recognition. Please try again.');
      }
    }
  };

  // Create debounced version of analyzeJob
  const debouncedAnalyzeJob = debounce(async () => {
    if (!jobDescription.trim()) return;

    setIsLoading(true);
    setError(null);
    setCategories([]);
    setSelectedCategory('');
    setProfessionals([]);

    try {
      const [categories, error] = await analyzeJobWithGrok(jobDescription);
      
      if (error) {
        setError(error);
        return;
      }

      if (categories) {
        setCategories(categories);
        if (categories.length > 0) {
          const selectedCategory = categories[0].name;
          setSelectedCategory(selectedCategory);
          
          // Get mock results
          const mockResults = mockProfessionals[selectedCategory] || [];
          setProfessionals(mockResults.map(p => ({ ...p, source: 'mock' as const })));
        }
      }

      // After successful analysis, check if location is needed
      if (!location.trim()) {
        setNeedsLocation(true);
        // Stop any ongoing recognition before asking for location
        recognition.stop();
        speak("For which location?");
        // Focus the location input
        if (locationInputRef.current) {
          locationInputRef.current.focus();
        }
        // After stop, onend will trigger the robust restart for location
        shouldRestartRecognitionRef.current = true;
        setIsLocationListening(true);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, 500); // 500ms delay

  // Add new function to parse job description and location
  const parseJobAndLocation = (input: string): { jobDescription: string; location: string | null } => {
    // Common location indicators
    const locationIndicators = [
      'in',
      'at',
      'near',
      'around',
      'located in',
      'based in',
      'from',
      'to',
      'for',
    ];

    // Common location patterns
    const locationPatterns = [
      /(?:in|at|near|around|located in|based in|from|to|for)\s+([^,.]+(?:,\s*[^,.]+)*)/i,
      /([^,.]+(?:,\s*[^,.]+)*)\s+(?:area|region|neighborhood|district)/i,
    ];

    // Phrases that should not be considered as locations
    const nonLocationPhrases = [
      'my house',
      'my home',
      'my apartment',
      'my place',
      'my room',
      'my bathroom',
      'my kitchen',
      'my living room',
      'my bedroom',
      'my office',
      'my building',
      'my property',
      'my yard',
      'my garden',
      'my garage',
      'my basement',
      'my attic',
      'my condo',
      'my unit',
      'my space',
      'my area',
      'my location',
      'my address',
      'my residence',
      'my dwelling',
      'my premises',
      'my establishment',
      'my facility',
      'my site',
      'my spot',
      'my position',
      'my whereabouts',
      'my vicinity',
      'my surroundings',
      'my neighborhood',
      'my block',
      'my street',
      'my road',
      'my avenue',
      'my boulevard',
      'my lane',
      'my drive',
      'my way',
      'my path',
      'my route',
      'my direction',
      'my destination',
      'my stop',
      'my station',
      'my terminal',
      'my port',
      'my harbor',
      'my dock',
      'my pier',
      'my wharf',
      'my marina',
      'my berth',
      'my anchorage',
      'my mooring',
      'my slip',
      'my quay',
      'my jetty',
      'my landing',
      'my platform',
      'my stage',
      'my stand',
      'my post',
      'my position',
      'my station',
      'my place',
      'my spot',
      'my point',
      'my mark',
      'my sign',
      'my signal',
      'my beacon',
      'my landmark',
      'my monument',
      'my memorial',
      'my shrine',
      'my temple',
      'my church',
      'my mosque',
      'my synagogue',
      'my cathedral',
      'my chapel',
      'my sanctuary',
      'my altar',
      'my pulpit',
      'my pew',
      'my seat',
      'my chair',
      'my bench',
      'my stool',
      'my table',
      'my desk',
      'my counter',
      'my shelf',
      'my rack',
      'my stand',
      'my mount',
      'my bracket',
      'my holder',
      'my container',
      'my box',
      'my case',
      'my bag',
      'my sack',
      'my pouch',
      'my pocket',
      'my compartment',
      'my chamber',
      'my room',
      'my hall',
      'my corridor',
      'my passage',
      'my walkway',
      'my path',
      'my trail',
      'my track',
      'my route',
      'my way',
      'my road',
      'my street',
      'my avenue',
      'my boulevard',
      'my lane',
      'my drive',
    ];

    let jobDescription = input;
    let location: string | null = null;

    // First, check if the input contains any non-location phrases
    const containsNonLocationPhrase = nonLocationPhrases.some(phrase => 
      input.toLowerCase().includes(phrase.toLowerCase())
    );

    // If it contains a non-location phrase, don't try to extract a location
    if (containsNonLocationPhrase) {
      return { jobDescription: input, location: null };
    }

    // Try to find location using patterns
    for (const pattern of locationPatterns) {
      const match = input.match(pattern);
      if (match) {
        const potentialLocation = match[1].trim();
        
        // Check if the potential location is not a non-location phrase
        const isNonLocation = nonLocationPhrases.some(phrase => 
          potentialLocation.toLowerCase().includes(phrase.toLowerCase())
        );

        if (!isNonLocation) {
          location = potentialLocation;
          // Remove the location part from the job description
          jobDescription = input.replace(match[0], '').trim();
          break;
        }
      }
    }

    // If no location found with patterns, try splitting by location indicators
    if (!location) {
      for (const indicator of locationIndicators) {
        const parts = input.split(new RegExp(`\\b${indicator}\\b`, 'i'));
        if (parts.length > 1) {
          const potentialLocation = parts[1].trim();
          
          // Check if the potential location is not a non-location phrase
          const isNonLocation = nonLocationPhrases.some(phrase => 
            potentialLocation.toLowerCase().includes(phrase.toLowerCase())
          );

          if (!isNonLocation) {
            jobDescription = parts[0].trim();
            location = potentialLocation;
            break;
          }
        }
      }
    }

    // Clean up the job description
    jobDescription = jobDescription
      .replace(/\s+/g, ' ')
      .replace(/^[,\s]+|[,\s]+$/g, '')
      .trim();

    return { jobDescription, location };
  };

  // Update the Autocomplete initialization in the useEffect
  const initializeAutocomplete = () => {
    if (!locationInputRef.current || !window.google?.maps?.places) {
      console.error('Location input ref or Google Maps Places not available');
      return;
    }

    try {
      // Create new Autocomplete instance
      const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'ca' },
        fields: ['formatted_address', 'geometry', 'name'],
      });

      // Store the instance in the ref
      autocompleteRef.current = autocomplete;

      // Add place_changed listener
      const listener = autocomplete.addListener('place_changed', () => {
        const place = autocomplete?.getPlace();
        if (place?.formatted_address) {
          setLocation(place.formatted_address);
          // If we have a job description, analyze the job
          if (jobDescription.trim()) {
            analyzeJob();
          }
        }
      });

      console.log('Autocomplete initialized successfully');
    } catch (error) {
      console.error('Error initializing Autocomplete:', error);
    }
  };

  // Update getCurrentLocation function
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsGpsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use OpenStreetMap Nominatim for reverse geocoding with detailed address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&addressdetails=1`
          );
          const data = await response.json();
          
          const addressComponents = parseAddressComponents(data);
          
          if (addressComponents) {
            const formattedAddress = formatAddress(addressComponents);
            setLocation(formattedAddress);
            
            // If we have a job description, analyze the job
            if (jobDescription.trim()) {
              analyzeJob();
            }
          } else {
            setError('Could not determine your address');
          }
        } catch (error) {
          setError('Error getting your address');
          console.error('Geocoding error:', error);
        } finally {
          setIsGpsLoading(false);
        }
      },
      (error) => {
        setIsGpsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Please allow location access to use this feature');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable');
            break;
          case error.TIMEOUT:
            setError('Location request timed out');
            break;
          default:
            setError('An error occurred while getting your location');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  // Focus the location input when needsLocation is set to true
  useEffect(() => {
    if (needsLocation && locationInputRef.current) {
      locationInputRef.current.focus();
    }
  }, [needsLocation]);

  // Update the useEffect for Google Places Autocomplete
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API key is missing');
      return;
    }

    let autocomplete: google.maps.places.Autocomplete | null = null;
    let listener: google.maps.MapsEventListener | null = null;

    const initializeAutocomplete = () => {
      if (!locationInputRef.current || !window.google?.maps?.places) {
        console.error('Location input ref or Google Maps Places not available');
        return;
      }

      try {
        // Create new Autocomplete instance
        autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current, {
          types: ['geocode'],
          componentRestrictions: { country: 'ca' },
          fields: ['formatted_address', 'geometry', 'name'],
        });

        // Add place_changed listener
        listener = autocomplete.addListener('place_changed', () => {
          const place = autocomplete?.getPlace();
          if (place?.formatted_address) {
            setLocation(place.formatted_address);
            // If we have a job description, analyze the job
            if (jobDescription.trim()) {
              analyzeJob();
            }
          }
        });

        console.log('Autocomplete initialized successfully');
      } catch (error) {
        console.error('Error initializing Autocomplete:', error);
      }
    };

    // Load Google Maps script and initialize Autocomplete
    loadGoogleMapsScript(apiKey)
      .then(() => {
        console.log('Google Maps script loaded');
        // Small delay to ensure the input is ready
        setTimeout(initializeAutocomplete, 100);
      })
      .catch((error) => {
        console.error('Error loading Google Maps script:', error);
      });

    // Cleanup
    return () => {
      if (listener && window.google?.maps?.event) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, []); // Remove jobDescription from dependencies to prevent re-initialization

  // Add global style to hide Google logo
  useEffect(() => {
    const styleId = 'google-places-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .pac-container .pac-logo {
          display: none !important;
        }
        .pac-container::after {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const style = document.getElementById(styleId);
      if (style) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
            <TextField
              id="job-description"
              name="job-description"
              type="text"
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
              }}
              inputProps={{
                onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Tab' || e.key === 'Enter') {
                    analyzeJob();
                  }
                }
              }}
              placeholder="Describe your job..."
              fullWidth
              sx={{
                flex: 1,
                '& .MuiInputBase-root': {
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontSize: '16px',
                },
                '& input': {
                  padding: 0,
                },
              }}
              InputProps={{
                endAdornment: (
                  <Button
                    variant="text"
                    onClick={toggleListening}
                    sx={{
                      minWidth: 'auto',
                      px: 1,
                      color: isListening ? 'error.main' : 'primary.main',
                    }}
                    title={micPermissionError || (isListening ? 'Stop listening' : 'Start voice input')}
                  >
                    {isListening ? <MicOffIcon /> : <MicIcon />}
                  </Button>
                ),
              }}
            />
            {(needsLocation || location) && (
              <TextField
                id="location"
                name="location"
                fullWidth
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                placeholder="Enter your location..."
                inputRef={locationInputRef}
                sx={{
                  flex: 1,
                  '& .MuiInputBase-root': {
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '16px',
                  },
                  '& input': {
                    padding: 0,
                  },
                  ...styles.hideGoogleLogo
                }}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon 
                        sx={{ 
                          mr: 1, 
                          color: 'text.secondary',
                          cursor: 'pointer',
                          '&:hover': { color: 'primary.main' }
                        }}
                        onClick={getCurrentLocation}
                      />
                    </Box>
                  ),
                }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'stretch' }}>
            <Button
              variant="contained"
              onClick={analyzeJob}
              disabled={isLoading || !jobDescription.trim()}
              sx={{
                height: (needsLocation || location) ? '100%' : '56px',
                alignSelf: 'stretch',
              }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Search for help'}
            </Button>
          </Box>
        </Box>

        {micPermissionError && (
          <Typography 
            color="error" 
            sx={{ 
              mt: 2,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            {micPermissionError}
          </Typography>
        )}

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {isGpsLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Getting your location...
            </Typography>
          </Box>
        )}

        {categories.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Suggested Categories
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "contained" : "outlined"}
                  onClick={() => handleCategorySelect(category.name)}
                  sx={{ borderRadius: 2 }}
                >
                  {category.name} ({Math.round(category.confidence * 100)}%)
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {categories.length > 0 && process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 2, mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {`AI matches:
${categories.map(cat => `${cat.name}: ${(cat.confidence * 100).toFixed(1)}%`).join('\n')}`}
            </Typography>
          </Box>
        )}

        {professionals.length > 0 ? (
          <>
            <Box sx={{ mt: 3 }}>
              <Box sx={{ mb: 2, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography 
                  variant="body2" 
                  color="info.contrastText"
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <LocationOnIcon fontSize="small" />
                  Showing helpers within {searchRadius}km, sorted by distance
                </Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                Recommended Helpers
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {professionals.map((professional) => (
                  <Paper
                    key={professional.id}
                    elevation={1}
                    sx={{ p: 2, borderRadius: 2 }}
                  >
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 1,
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            bgcolor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'transparent',
                            fontSize: '0.875rem',
                            border: '1px dashed',
                            borderColor: 'divider'
                          }}
                          aria-hidden="true"
                        >
                          No picture
                        </Box>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {professional.name}
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{
                              ml: 1,
                              color: 'black',
                              bgcolor: 'rgba(255, 165, 0, 0.1)',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontWeight: 500
                            }}
                          >
                            HelperJack Verified
                          </Typography>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Rating: {professional.rating} • {professional.experience}
                        </Typography>
                        {professional.specialties && (
                          <Typography variant="body2" color="text.secondary">
                            Specialties: {professional.specialties}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          📍 {professional.address}
                          {professional.distance !== null && professional.distance !== undefined && (
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{
                                ml: 1,
                                color: professional.distance <= 5 ? 'primary.main' : 'error.main',
                                fontWeight: 500,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5
                              }}
                            >
                              • {formatDistance(professional.distance)}
                            </Typography>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                    {process.env.NODE_ENV === 'development' && (
                      <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                        <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                          {`User location: ${userCoordinates ? `${userCoordinates.lat}, ${userCoordinates.lng}` : 'N/A'}\nHelper location: ${professional.latitude ?? 'N/A'}, ${professional.longitude ?? 'N/A'}`}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                ))}
              </Box>
            </Box>
          </>
        ) : selectedCategory && location.trim() ? (
          <Box sx={{ mt: 3, p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No helpers found within {searchRadius}km
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Would you like to expand your search area?
            </Typography>
            <Button
              variant="outlined"
              onClick={increaseSearchRadius}
              startIcon={<LocationOnIcon />}
            >
              Search within {searchRadius + 5}km
            </Button>
          </Box>
        ) : null}
      </Paper>
    </Box>
  );
} 