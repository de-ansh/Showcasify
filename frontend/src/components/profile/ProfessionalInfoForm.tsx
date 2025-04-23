"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const professionalInfoSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  professional_title: z.string().optional(),
  bio: z.string().optional(),
  contact_info: z.object({
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
  }),
  social_links: z.object({
    linkedin: z.string().url("Invalid URL").optional(),
    github: z.string().url("Invalid URL").optional(),
    twitter: z.string().url("Invalid URL").optional(),
    portfolio: z.string().url("Invalid URL").optional(),
  }),
  skills: z.array(z.string()).optional(),
  profile_image_url: z.string().url("Invalid URL").optional(),
});

type ProfessionalInfoFormValues = z.infer<typeof professionalInfoSchema>;

interface ProfessionalInfoFormProps {
  initialData?: ProfessionalInfoFormValues | null;
  onSuccess: () => void;
}

export function ProfessionalInfoForm({ initialData, onSuccess }: ProfessionalInfoFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfessionalInfoFormValues>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: {
      full_name: initialData?.full_name || "",
      professional_title: initialData?.professional_title || "",
      bio: initialData?.bio || "",
      contact_info: {
        email: initialData?.contact_info?.email || "",
        phone: initialData?.contact_info?.phone || "",
        location: initialData?.contact_info?.location || "",
      },
      social_links: {
        linkedin: initialData?.social_links?.linkedin || "",
        github: initialData?.social_links?.github || "",
        twitter: initialData?.social_links?.twitter || "",
        portfolio: initialData?.social_links?.portfolio || "",
      },
      skills: initialData?.skills || [],
      profile_image_url: initialData?.profile_image_url || "",
    },
  });

  const onSubmit = async (data: ProfessionalInfoFormValues) => {
    setIsLoading(true);
    try {
      const method = initialData ? "PUT" : "POST";
      const response = await fetch("/api/profile", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save professional info");
      }

      toast.success("Professional information saved successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to save professional information");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="professional_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Title</FormLabel>
                <FormControl>
                  <Input placeholder="Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="contact_info.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_info.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_info.location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="New York, USA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="social_links.linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="social_links.github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="social_links.twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="social_links.portfolio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-portfolio.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="profile_image_url"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Profile Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update" : "Save"} Professional Information
        </Button>
      </form>
    </Form>
  );
} 