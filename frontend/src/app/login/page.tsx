'use client';

import { useEffect } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { AuthDebug } from '@/components/auth/auth-debug';
import { LoginDebugForm } from '@/components/auth/login-debug-form';

export default function LoginPage() {
  useEffect(() => {
    console.log('Login page loaded');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <LoginForm />
        <AuthDebug />
        <LoginDebugForm />
      </div>
    </div>
  );
} 