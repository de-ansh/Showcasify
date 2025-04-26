import apiClient from '@/lib/api-client';

export interface Experience {
  id: number;
  title: string;
  company: string;
  start_date: string;
  end_date?: string | null;
  description?: string;
}

export interface ExperienceCreate {
  title: string;
  company: string;
  start_date: string;
  end_date?: string | null;
  description?: string;
}

export const experiencesApi = {
  getAll: async (): Promise<Experience[]> => {
    const response = await apiClient.get('/api/experiences');
    return response.data;
  },

  get: async (id: number): Promise<Experience> => {
    const response = await apiClient.get(`/api/experiences/${id}`);
    return response.data;
  },

  create: async (experience: ExperienceCreate): Promise<Experience> => {
    const response = await apiClient.post('/api/experiences', experience);
    return response.data;
  },

  update: async (id: number, experience: ExperienceCreate): Promise<Experience> => {
    const response = await apiClient.put(`/api/experiences/${id}`, experience);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/experiences/${id}`);
  }
}; 