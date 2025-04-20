import { create } from 'zustand';
import { api, authApi } from './api';
import { toast } from 'sonner';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AxiosError } from 'axios';

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastFetchTime: number | null;
  
  // Actions
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

// Create the auth store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      lastFetchTime: null,
      
      setToken: (token) => {
        set({ token });
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          delete api.defaults.headers.common['Authorization'];
        }
      },
      
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
      
      setLoading: (isLoading) => {
        set({ isLoading });
      },
      
      login: async (email, password) => {
        try {
          set({ isLoading: true });
          const response = await authApi.login(email, password);
          const { access_token } = response;
          get().setToken(access_token);
          await get().fetchUser();
          toast.success('Logged in successfully');
        } catch (error) {
          console.error('AuthStore: Login error:', error);
          const errorMessage = 
            error instanceof Error ? error.message : 
            'Failed to login. Please check your credentials.';
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      register: async (name, email, password) => {
        try {
          set({ isLoading: true });
          await authApi.register(name, email, password);
          toast.success('Registration successful! Please log in.');
        } catch (error) {
          const axiosError = error as AxiosError<{ detail: string }>;
          toast.error(axiosError.response?.data?.detail || 'Failed to register');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      logout: () => {
        get().setToken(null);
        get().setUser(null);
        set({ lastFetchTime: null });
        toast.success('Logged out successfully');
      },
      
      fetchUser: async () => {
        const { token, lastFetchTime } = get();
        if (!token) return;
        
        // Only fetch if we haven't fetched in the last 5 minutes
        const now = Date.now();
        if (lastFetchTime && now - lastFetchTime < 5 * 60 * 1000) {
          return;
        }
        
        try {
          set({ isLoading: true });
          const response = await authApi.getMe();
          get().setUser(response.data);
          set({ lastFetchTime: now });
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 401) {
            get().logout();
          }
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateProfile: async (data) => {
        try {
          set({ isLoading: true });
          const response = await authApi.updateProfile(data);
          get().setUser(response.data);
          toast.success('Profile updated successfully');
        } catch (error) {
          const axiosError = error as AxiosError<{ detail: string }>;
          toast.error(axiosError.response?.data?.detail || 'Failed to update profile');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      uploadAvatar: async (file) => {
        try {
          set({ isLoading: true });
          const response = await authApi.uploadAvatar(file);
          get().setUser({...get().user, ...response.data} as User);
          toast.success('Avatar uploaded successfully');
        } catch (error) {
          const axiosError = error as AxiosError<{ detail: string }>;
          toast.error(axiosError.response?.data?.detail || 'Failed to upload avatar');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      forgotPassword: async (email) => {
        try {
          set({ isLoading: true });
          await authApi.forgotPassword(email);
          toast.success('Password reset email sent. Please check your inbox.');
        } catch (error) {
          const axiosError = error as AxiosError<{ detail: string }>;
          toast.error(axiosError.response?.data?.detail || 'Failed to send reset email');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      resetPassword: async (token, password) => {
        try {
          set({ isLoading: true });
          await authApi.resetPassword(token, password);
          toast.success('Password reset successfully. Please log in with your new password.');
        } catch (error) {
          const axiosError = error as AxiosError<{ detail: string }>;
          toast.error(axiosError.response?.data?.detail || 'Failed to reset password');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Function to initialize auth on app load
export function initAuth() {
  const { token, fetchUser } = useAuthStore.getState();
  
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchUser();
  }
} 