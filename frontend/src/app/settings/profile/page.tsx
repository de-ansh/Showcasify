'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { ProfileForm } from '@/components/profile/profile-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProjectForm } from '@/components/profile/ProjectForm';
import { EducationForm } from '@/components/profile/EducationForm';
import { ExperienceForm } from '@/components/profile/ExperienceForm';

export default function ProfileSettingsPage() {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage your profile information and portfolio
          </p>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="personal" className="flex-1">Personal Info</TabsTrigger>
            <TabsTrigger value="projects" className="flex-1">Projects</TabsTrigger>
            <TabsTrigger value="education" className="flex-1">Education</TabsTrigger>
            <TabsTrigger value="experience" className="flex-1">Experience</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <ProfileForm />
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <ProjectForm />
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <EducationForm />
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <ExperienceForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 