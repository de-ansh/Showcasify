'use client';

import { useEffect } from 'react';
import { initAuth } from '@/lib/auth';

export function AuthInitializer() {
  // Initialize auth on app load
  useEffect(() => {
    initAuth();
  }, []);

  // This component doesn't render anything
  return null;
} 