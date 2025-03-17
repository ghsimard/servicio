import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:3003/api/services';

export interface Service {
  id: string;
  name: string;
  translations: {
    id: string;
    language: string;
    translatedName: string;
  }[];
}

export interface ServiceError {
  message: string;
  details?: {
    serviceId: string;
    serviceName: string;
    translationCount: number;
    translations: {
      language: string;
      translatedName: string;
    }[];
  };
}

export async function getAllServices(): Promise<Service[]> {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch services');
  }
}

export async function deleteService(id: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      const serviceError: ServiceError = {
        message: error.response.data.message,
        details: error.response.data.details
      };
      throw serviceError;
    }
    throw new Error('Failed to delete service');
  }
} 