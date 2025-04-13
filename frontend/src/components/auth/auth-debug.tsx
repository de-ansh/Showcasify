'use client';

import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function AuthDebug() {
  const { user, isAuthenticated, token, logout } = useAuthStore();
  const [showDetails, setShowDetails] = useState(false);
  
  if (!isAuthenticated) {
    return <p className="text-sm text-gray-500">Not authenticated</p>;
  }
  
  return (
    <div className="p-4 border rounded-md mt-4 bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Auth Debug</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>
      </div>
      
      {showDetails && (
        <div className="mt-4 space-y-2">
          <p className="text-sm"><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p className="text-sm"><strong>User ID:</strong> {user?.id}</p>
          <p className="text-sm"><strong>Name:</strong> {user?.name}</p>
          <p className="text-sm"><strong>Email:</strong> {user?.email}</p>
          <p className="text-sm"><strong>Role:</strong> {user?.role}</p>
          <p className="text-sm"><strong>Has Avatar:</strong> {user?.avatar_url ? 'Yes' : 'No'}</p>
          <p className="text-sm"><strong>Token:</strong> {token?.substring(0, 10)}...{token?.substring(token.length - 10)}</p>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={logout}
            className="mt-4"
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
} 