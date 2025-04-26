import React, { forwardRef } from 'react';
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Checkbox } from '../checkbox';
import { Label } from '../label';

interface CheckboxInputProps {
  label?: string;
  error?: string;
  id?: string;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const CheckboxInput = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxInputProps
>(({
  label,
  error,
  id,
  ...props
}, ref) => {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox
        ref={ref}
        id={id}
        {...props}
      />
      {label && (
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor={id} className="text-sm font-normal">
            {label}
          </Label>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>
      )}
    </div>
  );
});

CheckboxInput.displayName = "CheckboxInput"; 