import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { experiencesApi, type Experience, type ExperienceCreate } from '@/lib/api/experiences';
import { toast } from 'sonner';

export const useExperiences = () => {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: experiencesApi.getAll,
  });
};

export const useExperienceCreate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ExperienceCreate) => experiencesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience added successfully');
    },
    onError: (error) => {
      console.error('Error creating experience:', error);
      toast.error('Failed to add experience');
    },
  });
};

export const useExperienceUpdate = (id: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ExperienceCreate) => experiencesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience updated successfully');
    },
    onError: (error) => {
      console.error('Error updating experience:', error);
      toast.error('Failed to update experience');
    },
  });
};

export const useExperienceDelete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => experiencesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting experience:', error);
      toast.error('Failed to delete experience');
    },
  });
}; 