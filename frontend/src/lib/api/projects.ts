import apiClient from '@/lib/api-client';

export interface Project {
  id: number;
  title: string;
  description?: string;
  project_url?: string;
  github_url?: string;
}

export interface ProjectCreate {
  title: string;
  description?: string;
  project_url?: string;
  github_url?: string;
}

export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    try {
      console.log('Fetching projects with token:', localStorage.getItem('auth-storage'));
      const response = await apiClient.get('/api/projects');
      console.log('Projects API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  get: async (id: number): Promise<Project> => {
    const response = await apiClient.get(`/api/projects/${id}`);
    return response.data;
  },

  create: async (project: ProjectCreate): Promise<Project> => {
    try {
      console.log('Creating project with data:', project);
      const response = await apiClient.post('/api/projects', project);
      console.log('Create project response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  update: async (id: number, project: ProjectCreate): Promise<Project> => {
    const response = await apiClient.put(`/api/projects/${id}`, project);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/projects/${id}`);
  }
}; 