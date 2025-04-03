import { useState } from 'react';
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

const analyzeJobWithGrok = async (description: string): Promise<[Category[] | null, string | null]> => {
  try {
    const response = await axios.post('https://api.x.ai/v1/chat/completions', {
      messages: [
        {
          role: "system",
          content: "You are a job analyzer. When given a job description, respond with a JSON object containing an array called 'categories'. Each category in the array must have a 'name' and 'confidence' field. The confidence must be between 0 and 1. Only suggest from these categories: Plumber, Electrician, Painter, Cleaner, General Contractor, or Handyman. For ceiling fan issues, prioritize Electrician with high confidence. DO NOT use markdown formatting in your response."
        },
        {
          role: "user",
          content: `Analyze this job description and suggest appropriate professional categories: "${description}"`
        }
      ],
      model: "grok-2-latest",
      stream: false,
      temperature: 0
    }, {
      headers: {
        'Authorization': 'Bearer xai-Po63wCzRhWjQrVZfonpFB2IPuOLbBxORD26aMB5vipuP1vASybUbpr2SSsuiDtEoZpaCzEKG9n1zALwW',
        'Content-Type': 'application/json'
      }
    });

    console.log('Grok API Response:', response.data);

    if (response.data.choices && response.data.choices[0]?.message?.content) {
      let content = response.data.choices[0].message.content;
      
      // Remove markdown formatting if present
      if (content.includes('```')) {
        content = content.replace(/```json\n|\n```/g, '');
      }
      
      try {
        const result = JSON.parse(content);
        if (Array.isArray(result.categories)) {
          return [result.categories, null];
        }
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return [null, 'Invalid JSON format in response'];
      }
    }
    return [null, 'Invalid response format from Grok API'];
  } catch (error) {
    console.error('Error calling Grok:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
      return [null, `API Error: ${error.response?.data?.error || error.message}`];
    }
    return [null, 'An unexpected error occurred'];
  }
};

// Mock professionals data
const mockProfessionals: Record<string, Professional[]> = {
  'Plumber': [
    { id: '1', name: 'John Smith', category: 'Plumber', rating: 4.8, experience: '10 years' },
    { id: '2', name: 'Mike Johnson', category: 'Plumber', rating: 4.5, experience: '8 years' },
  ],
  'Electrician': [
    { id: '3', name: 'Ghislain Simard', category: 'Electrician', rating: 4.9, experience: '15 years', specialties: 'Ceiling Fans, Home Wiring' },
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
    { id: '9', name: 'James Miller', category: 'Handyman', rating: 4.5, experience: '10 years', specialties: 'General Repairs, Installations' },
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
        <textarea
          className="w-full p-2 border rounded-md"
          rows={4}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="E.g., Need to fix a leaking pipe in the bathroom..."
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          onClick={analyzeJob}
          disabled={isLoading || !jobDescription}
        >
          {isLoading ? 'Analyzing...' : 'Find Professionals'}
        </button>
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