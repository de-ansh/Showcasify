'use client';

import { useSearchParams } from 'next/navigation';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isInvalid, setIsInvalid] = useState(false);
  
  useEffect(() => {
    if (!token) {
      setIsInvalid(true);
      setTimeout(() => {
        redirect('/forgot-password');
      }, 3000);
    }
  }, [token]);
  
  if (isInvalid) {
    return (
      <div className="h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <h1 className="text-3xl font-bold">Invalid Reset Link</h1>
          <p className="text-gray-500">
            This password reset link is invalid or has expired. 
            Redirecting you to request a new one...
          </p>
        </div>
      </div>
    );
  }
  
  if (!token) return null; // Handle loading state

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
} 