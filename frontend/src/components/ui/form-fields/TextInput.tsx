import React, { forwardRef } from 'react';
import { Input } from '../input';
import { Label } from '../label';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <Input 
          ref={ref} 
          className={`${error ? 'border-red-500' : ''} ${className || ''}`}
          {...props} 
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput"; 