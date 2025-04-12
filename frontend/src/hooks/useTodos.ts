"use client";

import { useState, useEffect, useCallback } from 'react';
import { todoApi, Todo, CreateTodoInput, UpdateTodoInput } from '@/lib/api';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all todos
  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await todoApi.getAll();
      setTodos(data);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Failed to fetch todos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new todo
  const createTodo = useCallback(async (todo: CreateTodoInput) => {
    try {
      const newTodo = await todoApi.create(todo);
      setTodos(prev => [...prev, newTodo]);
      return newTodo;
    } catch (err) {
      console.error('Error creating todo:', err);
      setError('Failed to create todo');
      throw err;
    }
  }, []);

  // Update a todo
  const updateTodo = useCallback(async (id: number, todo: UpdateTodoInput) => {
    try {
      const updatedTodo = await todoApi.update(id, todo);
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
      return updatedTodo;
    } catch (err) {
      console.error(`Error updating todo ${id}:`, err);
      setError('Failed to update todo');
      throw err;
    }
  }, []);

  // Delete a todo
  const deleteTodo = useCallback(async (id: number) => {
    try {
      await todoApi.delete(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error(`Error deleting todo ${id}:`, err);
      setError('Failed to delete todo');
      throw err;
    }
  }, []);

  // Toggle todo completion status
  const toggleTodoCompletion = useCallback(async (id: number, completed: boolean) => {
    return updateTodo(id, { completed });
  }, [updateTodo]);

  // Load todos on initial render
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    isLoading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompletion,
  };
} 