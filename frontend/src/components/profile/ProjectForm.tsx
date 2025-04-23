"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface Project {
  id?: number;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  url?: string;
  technologies?: string;
}

interface ProjectFormProps {
  onSuccess: () => void;
}

export function ProjectForm({ onSuccess }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [project, setProject] = useState<Project>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    is_current: false,
    url: "",
    technologies: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/profile/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        throw new Error("Failed to save project");
      }

      toast.success("Project saved successfully");
      onSuccess();
      setProject({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        is_current: false,
        url: "",
        technologies: "",
      });
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Project Title</Label>
          <Input
            id="title"
            name="title"
            value={project.title}
            onChange={handleChange}
            placeholder="My Awesome Project"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">Project URL</Label>
          <Input
            id="url"
            name="url"
            type="url"
            value={project.url}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="technologies">Technologies Used</Label>
          <Input
            id="technologies"
            name="technologies"
            value={project.technologies}
            onChange={handleChange}
            placeholder="React, Node.js, PostgreSQL"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            value={project.start_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            value={project.end_date}
            onChange={handleChange}
            disabled={project.is_current}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_current"
            name="is_current"
            checked={project.is_current}
            onCheckedChange={(checked) => 
              setProject(prev => ({ ...prev, is_current: checked as boolean }))
            }
          />
          <Label htmlFor="is_current">Currently Working</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={project.description}
          onChange={handleChange}
          placeholder="Describe your project..."
          rows={4}
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Project"}
      </Button>
    </form>
  );
} 