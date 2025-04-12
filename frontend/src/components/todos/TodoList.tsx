"use client";

import { useTodos } from '@/hooks/useTodos';
import { TodoItem } from './TodoItem';
import { Todo } from '@/lib/api';
import { useState } from 'react';
import TodoForm from '@/components/todos/TodoForm';

export default function TodoList() {
  const { todos, isLoading, error, deleteTodo, toggleTodoCompletion, updateTodo, createTodo } = useTodos();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleCancel = () => {
    setEditingTodo(null);
  };

  const handleSave = async (title: string, description: string, completed: boolean) => {
    if (editingTodo) {
      await updateTodo(editingTodo.id, { title, description, completed });
      setEditingTodo(null);
    } else {
      await createTodo({ title, description, completed });
    }
  };

  // Wrapper for toggleTodoCompletion to handle the Promise correctly
  const handleToggleComplete = async (id: number, completed: boolean) => {
    await toggleTodoCompletion(id, completed);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading todos...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Todos</h1>

      {/* Todo Form */}
      <div className="mb-8">
        <TodoForm 
          onSave={handleSave}
          onCancel={editingTodo ? handleCancel : undefined}
          initialValues={editingTodo ? {
            title: editingTodo.title,
            description: editingTodo.description || '',
            completed: editingTodo.completed
          } : undefined}
          isEditing={!!editingTodo}
        />
      </div>

      {/* Todo List */}
      <div>
        {todos.length === 0 ? (
          <div className="text-center text-gray-500 p-8">
            No todos yet. Create one above!
          </div>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>
    </div>
  );
} 