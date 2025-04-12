import axios from 'axios';

// Define API base URL with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

console.log('Using API URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Handle CORS
  withCredentials: false,
});

// Define Todo interface
export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string | null;
}

// Create new Todo type without id and timestamps (for creating new todos)
export type CreateTodoInput = Pick<Todo, 'title' | 'description' | 'completed'>;

// Create Todo update type with all fields optional
export type UpdateTodoInput = Partial<CreateTodoInput>;

// Todo API service
export const todoApi = {
  // Get all todos
  getAll: async (): Promise<Todo[]> => {
    try {
      const response = await api.get<Todo[]>('/todos/');
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      return [];
    }
  },

  // Get a single todo by ID
  getById: async (id: number): Promise<Todo> => {
    const response = await api.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  // Create a new todo
  create: async (todo: CreateTodoInput): Promise<Todo> => {
    const response = await api.post<Todo>('/todos/', todo);
    return response.data;
  },

  // Update an existing todo
  update: async (id: number, todo: UpdateTodoInput): Promise<Todo> => {
    const response = await api.put<Todo>(`/todos/${id}`, todo);
    return response.data;
  },

  // Delete a todo
  delete: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },
};

export default api; 