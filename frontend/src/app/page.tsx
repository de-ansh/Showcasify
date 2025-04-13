'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <div className="max-w-3xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold">Welcome to Showcasify</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            A platform to showcase your work and connect with others
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold">User Profiles</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Create and customize your personal profile
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold">Secure Authentication</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Robust authentication and password management
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold">Custom Avatars</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Upload and manage your profile picture
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
