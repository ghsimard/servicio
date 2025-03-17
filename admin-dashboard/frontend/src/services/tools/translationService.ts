import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002/api/translation';

export interface TranslationJob {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  totalServices: number;
  completedServices: number;
  errors: string[];
}

export async function startTranslation(targetLanguage: 'fr' | 'es'): Promise<TranslationJob> {
  const response = await axios.post(`${API_BASE_URL}/start`, { targetLanguage });
  return response.data;
}

export async function translateExistingServices(): Promise<TranslationJob> {
  const response = await axios.post(`${API_BASE_URL}/translate-existing`);
  return response.data;
}

export async function getTranslationStatus(jobId: string): Promise<TranslationJob> {
  const response = await axios.get(`${API_BASE_URL}/status/${jobId}`);
  return response.data;
}

export async function cancelTranslation(jobId: string): Promise<void> {
  await axios.post(`${API_BASE_URL}/cancel/${jobId}`);
} 