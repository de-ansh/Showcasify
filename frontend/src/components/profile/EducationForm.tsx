"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/form-fields";
import { CheckboxInput } from "@/components/ui/form-fields";
import { useEducations, useEducationCreate, useEducationUpdate, useEducationDelete } from "@/lib/hooks/use-educations";
import { type Education } from "@/lib/api/educations";

const currentYear = new Date().getFullYear();

const educationSchema = z.object({
  school: z.string().min(1, "School name is required"),
  degree: z.string().optional(),
  start_year: z.coerce.number()
    .int("Year must be a valid number")
    .min(1900, "Year must be after 1900")
    .max(currentYear, `Year cannot be later than ${currentYear}`),
  end_year: z.coerce.number()
    .int("Year must be a valid number")
    .min(1900, "Year must be after 1900")
    .max(currentYear + 10, `Year seems too far in the future`)
    .optional()
    .nullable(),
  is_current: z.boolean().optional()
});

type EducationFormValues = z.infer<typeof educationSchema>;

export function EducationForm() {
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // React Query hooks
  const { data: educations = [], isLoading } = useEducations();
  const createMutation = useEducationCreate();
  const updateMutation = useEducationUpdate(editingId || 0);
  const deleteMutation = useEducationDelete();
  
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      school: "",
      degree: "",
      start_year: undefined,
      end_year: undefined,
      is_current: false
    }
  });

  const isCurrent = watch("is_current");

  const onSubmit = async (data: EducationFormValues) => {
    // If current education, set end_year to null
    if (data.is_current) {
      data.end_year = null;
    }
    
    // Remove is_current as it's not part of the API schema
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { is_current, ...submissionData } = data;
    
    try {
      if (editingId !== null) {
        // Update existing education
        await updateMutation.mutateAsync(submissionData);
      } else {
        // Create new education
        await createMutation.mutateAsync(submissionData);
      }
      
      reset();
      setEditingId(null);
    } catch (error) {
      console.error("Error saving education:", error);
    }
  };

  const handleEdit = (education: Education) => {
    setValue("school", education.school);
    setValue("degree", education.degree || "");
    setValue("start_year", education.start_year);
    
    // If end_year is null, it's current education
    const isCurrentEducation = education.end_year === null;
    setValue("is_current", isCurrentEducation);
    setValue("end_year", isCurrentEducation ? undefined : education.end_year);
    
    setEditingId(education.id);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this education entry?")) {
      return;
    }
    
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting education:", error);
    }
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">
          {editingId ? "Edit Education" : "Add New Education"}
        </h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextInput
            label="School/University"
            {...register("school")}
            error={errors.school?.message}
          />
          
          <TextInput
            label="Degree"
            {...register("degree")}
            error={errors.degree?.message}
            placeholder="e.g. Bachelor of Science in Computer Science"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Start Year"
              type="number"
              {...register("start_year")}
              error={errors.start_year?.message}
            />
            
            {!isCurrent && (
              <TextInput
                label="End Year"
                type="number"
                {...register("end_year")}
                error={errors.end_year?.message}
                disabled={isCurrent}
              />
            )}
          </div>
          
          <CheckboxInput
            label="I am currently studying here"
            {...register("is_current")}
          />
          
          <div className="flex space-x-2">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : (editingId ? "Update Education" : "Add Education")}
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
        <h3 className="text-lg font-medium p-6 border-b">Your Education</h3>
        
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : educations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            You haven&apos;t added any education history yet.
          </div>
        ) : (
          <ul className="divide-y">
            {educations.map((education) => (
              <li key={education.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{education.school}</h4>
                    {education.degree && (
                      <p className="text-gray-600 dark:text-gray-400">{education.degree}</p>
                    )}
                    
                    <p className="text-gray-500 text-sm mt-1">
                      {education.start_year} - {education.end_year || "Present"}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(education)}
                    >
                      Edit
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(education.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending && deleteMutation.variables === education.id ? "Deleting..." : "Delete"}
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