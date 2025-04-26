import axios from 'axios';

// Base API URL from environment or default to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with base URL
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('auth-storage') 
      : null;
    
    if (token) {
      try {
        const parsedStorage = JSON.parse(token);
        const authToken = parsedStorage.state?.token;
        if (authToken) {
          config.headers.Authorization = `Bearer ${authToken}`;
        }
      } catch (error) {
        console.error('Error parsing auth token:', error);
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Types for our API responses
export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string | null;
  role?: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// Auth API functions
export const authApi = {
  // Login with email and password
  login: async (email: string, password: string) => {
    // Create form data for OAuth2 token endpoint
    // Note: The backend expects username (not email) in the form data
    const formData = new FormData();
    formData.append('username', email); // using email as username
    formData.append('password', password);
    
    console.log('API: Sending OAuth2 login request to', API_URL + '/api/auth/token');
    try {
      const response = await api.post('/api/auth/token', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('API: Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: Login error:', error);
      throw error;
    }
  },
  
  // Register new user
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/api/users/', {
      name,
      email,
      password,
    });
    return response.data;
  },
  
  // Get current user info
  getMe: async () => {
    const response = await api.get('/api/users/me');
    return response;
  },
  
  // Update user profile
  updateProfile: async (data: Partial<User>) => {
    const response = await api.put('/api/users/me', data);
    return response;
  },
  
  // Upload user avatar
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
  
  // Request password reset
  forgotPassword: async (email: string) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },
  
  // Reset password with token
  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/api/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },
};

// User API functions
export const userApi = {
  // Get all users (admin only)
  getUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },
  
  // Get user by ID
  getUserById: async (id: string) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },
};

export default api; 