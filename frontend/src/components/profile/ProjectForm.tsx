"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { TextInput, TextareaInput } from "@/components/ui/form-fields";
import { useProjects, useProjectCreate, useProjectUpdate, useProjectDelete } from "@/lib/hooks/use-projects";
import { type Project } from "@/lib/api/projects";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  project_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  github_url: z.string().url("Please enter a valid URL").optional().or(z.literal(""))
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export function ProjectForm() {
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // React Query hooks
  const { data: projects = [], isLoading } = useProjects();
  const createMutation = useProjectCreate();
  const updateMutation = useProjectUpdate(editingId || 0);
  const deleteMutation = useProjectDelete();
  
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      project_url: "",
      github_url: ""
    }
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      if (editingId !== null) {
        // Update existing project
        await updateMutation.mutateAsync(data);
      } else {
        // Create new project
        await createMutation.mutateAsync(data);
      }
      
      reset();
      setEditingId(null);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleEdit = (project: Project) => {
    setValue("title", project.title);
    setValue("description", project.description || "");
    setValue("project_url", project.project_url || "");
    setValue("github_url", project.github_url || "");
    setEditingId(project.id);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }
    
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting project:", error);
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
          {editingId ? "Edit Project" : "Add New Project"}
        </h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextInput
            label="Project Title"
            {...register("title")}
            error={errors.title?.message}
          />
          
          <TextareaInput
            label="Description"
            {...register("description")}
            error={errors.description?.message}
          />
          
          <TextInput
            label="Project URL"
            {...register("project_url")}
            error={errors.project_url?.message}
            placeholder="https://..."
          />
          
          <TextInput
            label="GitHub URL"
            {...register("github_url")}
            error={errors.github_url?.message}
            placeholder="https://github.com/..."
          />
          
          <div className="flex space-x-2">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : (editingId ? "Update Project" : "Add Project")}
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
        <h3 className="text-lg font-medium p-6 border-b">Your Projects</h3>
        
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            You haven&apos;t added any projects yet.
          </div>
        ) : (
          <ul className="divide-y">
            {projects.map((project) => (
              <li key={project.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{project.title}</h4>
                    {project.description && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
                    )}
                    
                    <div className="mt-2 space-x-4">
                      {project.project_url && (
                        <a 
                          href={project.project_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                        >
                          View Project
                        </a>
                      )}
                      
                      {project.github_url && (
                        <a 
                          href={project.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(project)}
                    >
                      Edit
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending && deleteMutation.variables === project.id ? "Deleting..." : "Delete"}
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