"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ProfessionalInfoForm } from "@/components/profile/ProfessionalInfoForm";
import { EducationForm } from "@/components/profile/EducationForm";
import { ProjectForm } from "@/components/profile/ProjectForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ProfessionalInfo {
  full_name: string;
  contact_info: {
    email?: string;
    phone?: string;
    location?: string;
  };
  social_links: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  bio?: string;
  professional_title?: string;
}

// interface Education {
//   id: number;
//   institution: string;
//   degree: string;
//   field_of_study: string;
//   start_date: string;
//   end_date?: string;
//   is_current: boolean;
//   description?: string;
// }

// interface Project {
//   id: number;
//   title: string;
//   description: string;
//   start_date?: string;
//   end_date?: string;
//   is_current: boolean;
//   url?: string;
//   technologies?: string;
// }

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("professional");
  const [isLoading, setIsLoading] = useState(true);
  const [professionalInfo, setProfessionalInfo] = useState<ProfessionalInfo | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profile");
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      const data = await response.json();
      
      // Transform the data to match the new structure
      setProfessionalInfo({
        full_name: data.full_name || "",
        contact_info: {
          email: data.email,
          phone: data.phone,
          location: data.location
        },
        social_links: {
          linkedin: data.linkedin,
          github: data.github,
          twitter: data.twitter,
          portfolio: data.website
        },
        bio: data.bio,
        professional_title: data.title
      });

    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Professional Profile</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="professional">Professional Info</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfessionalInfoForm 
                initialData={professionalInfo}
                onSuccess={fetchProfileData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>Education History</CardTitle>
            </CardHeader>
            <CardContent>
              <EducationForm 
                onSuccess={fetchProfileData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectForm 
                onSuccess={fetchProfileData}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 