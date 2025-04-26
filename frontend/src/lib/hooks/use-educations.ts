import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { educationsApi, type Education, type EducationCreate } from '@/lib/api/educations';
import { toast } from 'sonner';

export const useEducations = () => {
  return useQuery({
    queryKey: ['educations'],
    queryFn: educationsApi.getAll,
  });
};

export const useEducationCreate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: EducationCreate) => educationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educations'] });
      toast.success('Education added successfully');
    },
    onError: (error) => {
      console.error('Error creating education:', error);
      toast.error('Failed to add education');
    },
  });
};

export const useEducationUpdate = (id: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: EducationCreate) => educationsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educations'] });
      toast.success('Education updated successfully');
    },
    onError: (error) => {
      console.error('Error updating education:', error);
      toast.error('Failed to update education');
    },
  });
};

export const useEducationDelete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => educationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educations'] });
      toast.success('Education deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting education:', error);
      toast.error('Failed to delete education');
    },
  });
}; 