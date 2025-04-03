import { useState, useEffect } from 'react';
import axios from 'axios';

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
  }
}

interface CategoryResponse {
  name: string;
  confidence: number;
}

const analyzeJobWithGrok = async (description: string): Promise<[Category[] | null, string | null]> => {
  try {
    const response = await axios.post('https://api.x.ai/v1/chat/completions', {
      messages: [
        {
          role: "system",
          content: "You are a job analyzer. You must respond with ONLY a JSON object and nothing else. The JSON must be in this exact format: {\"categories\": [{\"name\": \"Category\", \"confidence\": 0.95}]}. Each category name must be one of: Plumber, Electrician, Painter, Cleaner, General Contractor, or Handyman. The confidence value must be between 0 and 1. For ceiling fan issues, include Electrician with high confidence. Do not include any explanations, markdown, or additional text."
        },
        {
          role: "user",
          content: `Return a JSON object with categories for this job: "${description}"`
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

    console.log('Raw Grok API Response:', response.data);

    if (!response.data.choices?.[0]?.message?.content) {
      console.error('Invalid response structure:', response.data);
      return [null, 'Invalid response structure from Grok API'];
    }

    let content = response.data.choices[0].message.content.trim();
    console.log('Raw content:', content);
    
    // Remove any non-JSON content
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('No JSON object found in response');
      return [null, 'Invalid response format: no JSON object found'];
    }
    
    content = content.slice(jsonStart, jsonEnd + 1);
    console.log('Extracted JSON:', content);
    
    try {
      const result = JSON.parse(content);
      
      // Validate response structure
      if (!result.categories || !Array.isArray(result.categories)) {
        console.error('Missing or invalid categories array:', result);
        return [null, 'Invalid response format: missing categories array'];
      }

      // Validate and sanitize categories
      const validCategories = result.categories
        .filter((cat: CategoryResponse) => {
          const isValid = 
            cat?.name && 
            typeof cat.name === 'string' && 
            typeof cat.confidence === 'number' && 
            cat.confidence >= 0 && 
            cat.confidence <= 1;
          
          if (!isValid) {
            console.warn('Invalid category:', cat);
          }
          return isValid;
        })
        .map((cat: CategoryResponse) => ({
          name: cat.name.trim(),
          confidence: Math.min(Math.max(cat.confidence, 0), 1) // Ensure confidence is between 0 and 1
        }));

      if (validCategories.length === 0) {
        console.error('No valid categories found:', result.categories);
        // Provide fallback categories
        if (description.toLowerCase().includes('ceiling fan')) {
          return [[
            { name: 'Electrician', confidence: 0.95 },
            { name: 'Handyman', confidence: 0.75 }
          ], 'Using fallback categories due to validation failure'];
        }
        return [null, 'No valid categories found in response'];
      }

      return [validCategories, null];
    } catch (error) {
      console.error('JSON Parse Error:', error, '\nContent:', content);
      // Fallback categories for common issues
      if (description.toLowerCase().includes('ceiling fan')) {
        return [[
          { name: 'Electrician', confidence: 0.95 },
          { name: 'Handyman', confidence: 0.75 }
        ], 'Using fallback categories due to parsing error'];
      }
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
    { id: '1', name: 'John Smith', category: 'Plumber', rating: 4.8, experience: '10 years' },
    { id: '2', name: 'Charlotte Piper', category: 'Plumber', rating: 4.5, experience: '8 years' },
  ],
  'Electrician': [
    { id: '3', name: 'Ghislain Simard', category: 'Electrician', rating: 4.9, experience: '15 years', specialties: 'Ceiling Fans, Home Wiring, Switch fixing Magician' },
    { id: '4', name: 'Tom Brown', category: 'Electrician', rating: 4.7, experience: '12 years', specialties: 'Electrical Repairs, Installations' },
    { id: '5', name: 'Alex Rivera', category: 'Electrician', rating: 4.8, experience: '10 years', specialties: 'Fans, Lighting, Power Systems' },
  ],
  'Painter': [
    { id: '6', name: 'David Lee', category: 'Painter', rating: 4.6, experience: '7 years' },
  ],
  'Cleaner': [
    { id: '7', name: 'Maria Garcia', category: 'Cleaner', rating: 4.8, experience: '5 years' },
  ],
  'General Contractor': [
    { id: '8', name: 'Bob Wilson', category: 'General Contractor', rating: 4.7, experience: '20 years' },
  ],
  'Handyman': [
    { id: '9', name: 'Joseph Maalouf', category: 'Handyman', rating: 4.5, experience: '-23,4 years', specialties: 'General Repairs, Installations, Better to be a Needer'},
    { id: '10', name: 'Carlos Mendez', category: 'Handyman', rating: 4.6, experience: '8 years', specialties: 'Fans, Furniture Assembly' },
  ],
};

export default function JobMatcher() {
  const [jobDescription, setJobDescription] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      // Change to non-continuous mode to reduce network load
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join(' ');
        setJobDescription(prev => prev + ' ' + transcript.trim());
        // Reset retry count on successful result
        setRetryCount(0);
        // Automatically restart listening if needed
        if (isListening) {
          try {
            recognition.start();
          } catch (error) {
            console.error('Error restarting recognition:', error);
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error, event.message);
        let errorMessage = 'Speech recognition failed. Please try again or type manually.';
        
        switch (event.error) {
          case 'network':
            if (retryCount < MAX_RETRIES) {
              // Attempt to restart recognition with exponential backoff
              setRetryCount(prev => prev + 1);
              const delay = Math.min(1000 * Math.pow(2, retryCount), 8000); // Max 8 second delay
              errorMessage = `Network error (attempt ${retryCount + 1}/${MAX_RETRIES}). Retrying in ${delay/1000} seconds...`;
              try {
                recognition.stop();
                setTimeout(() => {
                  if (isListening) {
                    try {
                      recognition.start();
                    } catch (err) {
                      console.error('Error during retry:', err);
                      setIsListening(false);
                      setError('Failed to restart speech recognition. Please try again later.');
                    }
                  }
                }, delay);
              } catch (err) {
                console.error('Error stopping recognition:', err);
              }
            } else {
              errorMessage = 'Network error. Speech recognition will continue in offline mode.';
              setIsListening(false);
              // Switch to offline mode by keeping the text input enabled
              setError('Speech recognition unavailable. Please type your request.');
            }
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please check your browser settings and refresh the page.';
            setIsListening(false);
            break;
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking again or check your microphone.';
            // Don't stop listening on no-speech, just notify
            if (isListening) {
              try {
                recognition.start();
              } catch (err) {
                console.error('Error restarting after no-speech:', err);
              }
            }
            break;
          case 'aborted':
            if (!isListening) {
              // If we intentionally stopped, don't show error
              errorMessage = '';
            } else {
              errorMessage = 'Speech recognition was interrupted. Attempting to restart...';
              try {
                recognition.start();
              } catch (err) {
                console.error('Error restarting after abort:', err);
                setIsListening(false);
                errorMessage = 'Could not restart speech recognition. Please try again.';
              }
            }
            break;
          case 'audio-capture':
            errorMessage = 'No microphone detected. Please connect a microphone and refresh the page.';
            setIsListening(false);
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service is not available. Please try using Chrome or Edge browser.';
            setIsListening(false);
            break;
        }
        
        if (errorMessage) {
          setError(errorMessage);
        }
      };

      recognition.onend = () => {
        // Only attempt to restart if we're supposed to be listening and haven't exceeded retries
        if (isListening && retryCount < MAX_RETRIES) {
          try {
            recognition.start();
          } catch (error) {
            console.error('Error restarting recognition:', error);
            setIsListening(false);
            setError('Speech recognition stopped. Please try again.');
          }
        }
      };

      setRecognition(recognition);
    }
  }, [isListening, retryCount]);

  const toggleListening = () => {
    if (!recognition) {
      setError('Speech recognition is not supported in your browser. Please try using Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setError(null);
      setRetryCount(0);
    } else {
      setError(null);
      setRetryCount(0);
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setError('Failed to start speech recognition. Please refresh the page and try again, or type manually.');
      }
    }
  };

  const analyzeJob = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [results, error] = await analyzeJobWithGrok(jobDescription);
      if (error) {
        setError(error);
        setCategories([
          { name: 'Electrician', confidence: 0.95 },
          { name: 'Handyman', confidence: 0.75 }
        ]);
      } else if (results) {
        setCategories(results);
      }
      setSelectedCategory('');
      setProfessionals([]);
    } catch (error) {
      console.error('Error analyzing job:', error);
      setError('Failed to analyze job description. Please try again.');
      setCategories([
        { name: 'Electrician', confidence: 0.95 },
        { name: 'Handyman', confidence: 0.75 }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setProfessionals(mockProfessionals[category] || []);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Find the Right Professional</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Describe the job or problem that needs to be solved
        </label>
        <div className="relative">
          <textarea
            className="w-full p-2 border rounded-md"
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="E.g., Need to fix a leaking pipe in the bathroom..."
          />
          <button
            onClick={toggleListening}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isListening 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title={isListening ? 'Stop dictating' : 'Start dictating'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="mt-2 flex gap-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            onClick={analyzeJob}
            disabled={isLoading || !jobDescription}
          >
            {isLoading ? 'Analyzing...' : 'Find Professionals'}
          </button>
          {isListening && (
            <span className="text-sm text-gray-600 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
              Listening...
            </span>
          )}
        </div>
        {error && (
          <p className="mt-2 text-red-600 text-sm">{error}</p>
        )}
      </div>

      {categories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Suggested Categories:</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategorySelect(category.name)}
                className={`block w-full text-left p-2 rounded-md ${
                  selectedCategory === category.name
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {category.name} ({Math.round(category.confidence * 100)}% match)
              </button>
            ))}
          </div>
        </div>
      )}

      {professionals.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Available Professionals:</h3>
          <div className="space-y-2">
            {professionals.map((professional) => (
              <div
                key={professional.id}
                className="p-3 border rounded-md bg-white"
              >
                <h4 className="font-medium">{professional.name}</h4>
                <p className="text-sm text-gray-600">
                  {professional.category} • {professional.experience} experience
                </p>
                {professional.specialties && (
                  <p className="text-sm text-gray-600 mt-1">
                    Specialties: {professional.specialties}
                  </p>
                )}
                <div className="flex items-center mt-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm ml-1">{professional.rating}/5.0</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 