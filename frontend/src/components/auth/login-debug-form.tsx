'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';

export function LoginDebugForm() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password');
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // Test direct axios call without interceptors
  const testDirectLogin = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    try {
      // Try JSON format
      const response = await axios.post(`${API_URL}/api/auth/login`, { 
        email, 
        password 
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setResult({
        success: true,
        data: response.data,
        endpoint: '/api/auth/login',
        format: 'JSON'
      });
    } catch (jsonError: any) {
      console.log('JSON login failed:', jsonError.response?.status, jsonError.response?.data);
      
      try {
        // Try FormData format at /auth/token
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        
        const formResponse = await axios.post(`${API_URL}/api/auth/token`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        setResult({
          success: true,
          data: formResponse.data,
          endpoint: '/api/auth/token',
          format: 'FormData'
        });
      } catch (formError: any) {
        console.log('FormData login failed:', formError.response?.status, formError.response?.data);
        
        setError({
          message: 'Both login attempts failed',
          jsonError: {
            status: jsonError.response?.status,
            data: jsonError.response?.data
          },
          formError: {
            status: formError.response?.status,
            data: formError.response?.data
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md mt-8 bg-gray-50 dark:bg-gray-900">
      <h3 className="font-medium mb-4">Login API Debug</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="debug-email">Email</Label>
          <Input
            id="debug-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="debug-password">Password</Label>
          <Input
            id="debug-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={testDirectLogin} 
          disabled={isLoading}
        >
          {isLoading ? 'Testing API...' : 'Test Login API'}
        </Button>
      </div>
      
      {result && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm">
          <h4 className="font-bold text-green-700 mb-2">Success!</h4>
          <p><strong>Endpoint:</strong> {result.endpoint}</p>
          <p><strong>Format:</strong> {result.format}</p>
          <pre className="mt-2 p-2 bg-white overflow-auto max-h-40 rounded text-xs">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm">
          <h4 className="font-bold text-red-700 mb-2">Error</h4>
          <pre className="mt-2 p-2 bg-white overflow-auto max-h-40 rounded text-xs">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 