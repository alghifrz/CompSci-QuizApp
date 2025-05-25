import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { twMerge } from 'tailwind-merge';
import { type VariantProps } from 'class-variance-authority';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

type ShadcnVariant = NonNullable<VariantProps<typeof ShadcnButton>['variant']>;
type ShadcnSize = NonNullable<VariantProps<typeof ShadcnButton>['size']>;

const variantMap = {
  primary: 'default',
  secondary: 'secondary',
  outline: 'outline'
} as const;

const sizeMap = {
  sm: 'sm',
  md: 'default',
  lg: 'lg'
} as const;

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <ShadcnButton
      variant={variantMap[variant] as ShadcnVariant}
      size={sizeMap[size] as ShadcnSize}
      className={`cursor-pointer ${twMerge(
        fullWidth ? 'w-full' : '',
        className
      )}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </ShadcnButton>
  );
} 