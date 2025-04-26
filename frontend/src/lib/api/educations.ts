import apiClient from '@/lib/api-client';

export interface Education {
  id: number;
  school: string;
  degree?: string;
  start_year: number;
  end_year?: number | null;
}

export interface EducationCreate {
  school: string;
  degree?: string;
  start_year: number;
  end_year?: number | null;
}

export const educationsApi = {
  getAll: async (): Promise<Education[]> => {
    const response = await apiClient.get('/api/educations');
    return response.data;
  },

  get: async (id: number): Promise<Education> => {
    const response = await apiClient.get(`/api/educations/${id}`);
    return response.data;
  },

  create: async (education: EducationCreate): Promise<Education> => {
    const response = await apiClient.post('/api/educations', education);
    return response.data;
  },

  update: async (id: number, education: EducationCreate): Promise<Education> => {
    const response = await apiClient.put(`/api/educations/${id}`, education);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/educations/${id}`);
  }
}; 