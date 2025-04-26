import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsApi, type ProjectCreate } from '@/lib/api/projects';
import { toast } from 'sonner';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });
};

export const useProjectCreate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ProjectCreate) => projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
    },
    onError: () => {
      toast.error('Failed to create project');
    },
  });
};

export const useProjectUpdate = (id: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ProjectCreate) => projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully');
    },
    onError: () => {
      toast.error('Failed to update project');
    },
  });
};

export const useProjectDelete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete project');
    },
  });
}; 