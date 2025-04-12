"use client";

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Todo } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  onToggleComplete: (id: number, completed: boolean) => Promise<void>;
  onEdit: (todo: Todo) => void;
}

export function TodoItem({ todo, onDelete, onToggleComplete, onEdit }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setIsDeleting(true);
      try {
        await onDelete(todo.id);
      } catch (error) {
        console.error('Error deleting todo:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    try {
      await onToggleComplete(todo.id, !todo.completed);
    } catch (error) {
      console.error('Error toggling todo completion:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Format date to relative time (e.g., "2 hours ago")
  const getRelativeTime = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      // Fall back to returning the original string on error
      return dateString;
    }
  };

  return (
    <Card className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Checkbox
            id={`todo-${todo.id}`}
            checked={todo.completed}
            onCheckedChange={handleToggleComplete}
            disabled={isUpdating}
            className="mt-1"
          />
          <div className="flex-1">
            <div className={`text-base font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </div>
            {todo.description && (
              <p className={`text-sm text-gray-600 mt-1 ${todo.completed ? 'text-gray-400' : ''}`}>
                {todo.description}
              </p>
            )}
            <div className="text-xs text-gray-500 mt-1">
              Created {getRelativeTime(todo.created_at)}
              {todo.updated_at && todo.updated_at !== todo.created_at && 
                ` • Updated ${getRelativeTime(todo.updated_at)}`}
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(todo)}
            className="h-8 w-8"
            aria-label="Edit todo"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
            disabled={isDeleting}
            aria-label="Delete todo"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 