"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface Education {
  id?: number;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
}

interface EducationFormProps {
  onSuccess: () => void;
}

export function EducationForm({ onSuccess }: EducationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [education, setEducation] = useState<Education>({
    institution: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/profile/education", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(education),
      });

      if (!response.ok) {
        throw new Error("Failed to save education");
      }

      toast.success("Education saved successfully");
      onSuccess();
      setEducation({
        institution: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        is_current: false,
        description: "",
      });
    } catch (error) {
      console.error("Error saving education:", error);
      toast.error("Failed to save education");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEducation(prev => ({ ...prev, [name]: value }));
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="institution">Institution</Label>
          <Input
            id="institution"
            name="institution"
            value={education.institution}
            onChange={handleChange}
            placeholder="University of Example"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="degree">Degree</Label>
          <Input
            id="degree"
            name="degree"
            value={education.degree}
            onChange={handleChange}
            placeholder="Bachelor of Science"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field_of_study">Field of Study</Label>
          <Input
            id="field_of_study"
            name="field_of_study"
            value={education.field_of_study}
            onChange={handleChange}
            placeholder="Computer Science"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            value={education.start_date}
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
            value={education.end_date}
            onChange={handleChange}
            disabled={education.is_current}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_current"
            name="is_current"
            checked={education.is_current}
            onCheckedChange={(checked) => 
              setEducation(prev => ({ ...prev, is_current: checked as boolean }))
            }
          />
          <Label htmlFor="is_current">Currently Studying</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={education.description}
          onChange={handleChange}
          placeholder="Describe your education experience..."
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Education"}
      </Button>
    </form>
  );
} 