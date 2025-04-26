"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TextInput, TextareaInput } from "@/components/ui/form-fields";
import { CheckboxInput } from "@/components/ui/form-fields";
import { useExperiences, useExperienceCreate, useExperienceUpdate, useExperienceDelete } from "@/lib/hooks/use-experiences";
import { type Experience } from "@/lib/api/experiences";

const experienceSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional().nullable(),
  description: z.string().optional(),
  is_current: z.boolean().optional()
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

export function ExperienceForm() {
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // React Query hooks
  const { data: experiences = [], isLoading } = useExperiences();
  const createMutation = useExperienceCreate();
  const updateMutation = useExperienceUpdate(editingId || 0);
  const deleteMutation = useExperienceDelete();
  
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: "",
      company: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false
    }
  });

  const isCurrent = watch("is_current");

  const onSubmit = async (data: ExperienceFormValues) => {
    // If current job, set end_date to null
    if (data.is_current) {
      data.end_date = null;
    }
    
    // Remove is_current as it's not part of the API schema
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { is_current, ...submissionData } = data;
    
    try {
      if (editingId !== null) {
        // Update existing experience
        await updateMutation.mutateAsync(submissionData);
      } else {
        // Create new experience
        await createMutation.mutateAsync(submissionData);
      }
      
      reset();
      setEditingId(null);
    } catch (error) {
      console.error("Error saving experience:", error);
    }
  };

  const handleEdit = (experience: Experience) => {
    setValue("title", experience.title);
    setValue("company", experience.company);
    setValue("start_date", experience.start_date);
    
    // If end_date is null, it's current job
    const isCurrentJob = experience.end_date === null;
    setValue("is_current", isCurrentJob);
    setValue("end_date", isCurrentJob ? "" : experience.end_date || "");
    setValue("description", experience.description || "");
    
    setEditingId(experience.id);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) {
      return;
    }
    
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
  };

  // Format date for display (e.g., Jan 2022)
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Present";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">
          {editingId ? "Edit Work Experience" : "Add New Work Experience"}
        </h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextInput
            label="Job Title"
            {...register("title")}
            error={errors.title?.message}
          />
          
          <TextInput
            label="Company"
            {...register("company")}
            error={errors.company?.message}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Start Date"
              type="date"
              {...register("start_date")}
              error={errors.start_date?.message}
            />
            
            {!isCurrent && (
              <TextInput
                label="End Date"
                type="date"
                {...register("end_date")}
                error={errors.end_date?.message}
                disabled={isCurrent}
              />
            )}
          </div>
          
          <CheckboxInput
            label="I currently work here"
            onCheckedChange={(checked) => setValue("is_current", checked)}
            checked={isCurrent}
          />
          
          <TextareaInput
            label="Description"
            {...register("description")}
            error={errors.description?.message}
            placeholder="Describe your responsibilities and achievements..."
          />
          
          <div className="flex space-x-2">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : (editingId ? "Update Experience" : "Add Experience")}
            </Button>
            
            {editingId && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-lg font-medium p-6 border-b">Your Work Experience</h3>
        
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : experiences.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            You haven&apos;t added any work experience yet.
          </div>
        ) : (
          <ul className="divide-y">
            {experiences.map((experience) => (
              <li key={experience.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{experience.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{experience.company}</p>
                    
                    <p className="text-gray-500 text-sm mt-1">
                      {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                    </p>
                    
                    {experience.description && (
                      <p className="text-gray-600 dark:text-gray-400 mt-2">{experience.description}</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(experience)}
                    >
                      Edit
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(experience.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending && deleteMutation.variables === experience.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 