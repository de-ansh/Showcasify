'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthInitializer } from "@/components/auth/auth-initializer";
import { Providers } from '@/lib/providers';

const navigationItems = [
  {
    title: 'Home',
    href: '/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
      </svg>
    ),
  },
  {
    title: 'Profile',
    href: '/settings/profile',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: 'Security',
    href: '/settings/security',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
    ),
  },
];

// List of public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password'];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user && !publicRoutes.includes(pathname)) {
      router.push('/login');
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <Providers>
          <AuthInitializer />
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {!isPublicRoute && user && (
              <>
                {/* Top Bar */}
                <header className="bg-white dark:bg-gray-800 shadow-sm">
                  <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Link href="/dashboard" className="text-xl font-bold">
                        Showcasify
                      </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {user.name}
                      </span>
                      <Button variant="outline" size="sm" onClick={() => logout()}>
                        Logout
                      </Button>
                    </div>
                  </div>
                </header>

                <div className="flex">
                  {/* Sidebar */}
                  <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm h-[calc(100vh-4rem)] fixed">
                    <nav className="p-4">
                      <ul className="space-y-2">
                        {navigationItems.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={cn(
                                'flex items-center space-x-3 px-4 py-2 rounded-md text-sm font-medium',
                                'hover:bg-gray-100 dark:hover:bg-gray-700',
                                'text-gray-700 dark:text-gray-300',
                                'transition-colors',
                                pathname === item.href && 'bg-gray-100 dark:bg-gray-700'
                              )}
                            >
                              {item.icon}
                              <span>{item.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </aside>

                  {/* Main Content */}
                  <main className="flex-1 ml-64 p-8">
                    {children}
                  </main>
                </div>
              </>
            )}

            {/* Public routes content */}
            {isPublicRoute && (
              <main className="min-h-screen">
                {children}
              </main>
            )}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
