import React, { forwardRef } from 'react';
import { Label } from '../label';
import { Textarea } from '../textarea';

interface TextareaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <Textarea 
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

TextareaInput.displayName = "TextareaInput"; 