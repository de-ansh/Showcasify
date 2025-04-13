import { create } from 'zustand';
import { api, authApi } from './api';
import { toast } from 'sonner';
import { persist, createJSONStorage } from 'zustand/middleware';

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
          console.log('AuthStore: Calling login API...');
          const response = await authApi.login(email, password);
          console.log('AuthStore: Login API response:', response);
          
          // The FastAPI auth token endpoint returns access_token directly
          const { access_token } = response;
          console.log('AuthStore: Got access token, setting token...');
          get().setToken(access_token);
          
          console.log('AuthStore: Fetching user data...');
          await get().fetchUser();
          console.log('AuthStore: Login complete');
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
          /* eslint-disable  @typescript-eslint/no-explicit-any */

        } catch (error: any) {
          toast.error(error.response?.data?.detail || 'Failed to register');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      logout: () => {
        get().setToken(null);
        get().setUser(null);
        toast.success('Logged out successfully');
      },
      
      fetchUser: async () => {
        const { token } = get();
        if (!token) return;
        
        try {
          set({ isLoading: true });
          const response = await authApi.getMe();
          get().setUser(response.data);
        } catch (error: any) {
          if (error.response?.status === 401) {
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
          
        } catch (error: any) {
          toast.error(error.response?.data?.detail || 'Failed to update profile');
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
        } catch (error: any) {
          toast.error(error.response?.data?.detail || 'Failed to upload avatar');
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
        } catch (error: any) {
          toast.error(error.response?.data?.detail || 'Failed to send reset email');
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
        } catch (error: any) {
          toast.error(error.response?.data?.detail || 'Failed to reset password');
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