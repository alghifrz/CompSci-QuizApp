import React, { useState, useEffect } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = '',
  placeholder,
  onFocus,
  onBlur,
  value,
  defaultValue,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  // Initialize hasValue based on initial value
  useEffect(() => {
    const initialValue = value || defaultValue || '';
    setHasValue(String(initialValue).length > 0);
  }, [value, defaultValue]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  return (
    <div className="relative">
      <input
        className={`
          w-full px-5 py-4 border rounded-lg bg-white
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-gray-100
          ${error ? 'border-red-500' : 'border-0'}
          ${className}
        `}
        value={value}
        defaultValue={defaultValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
      <label
        className={`
          absolute left-5 transition-all duration-200 pointer-events-none
          ${isFocused
            ? '-top-2.5 text-xs text-purple-600 bg-gray-100 px-1'
            : hasValue
              ? '-top-2.5 text-xs text-purple-600 bg-gray-100 px-1'
              : 'top-4 text-gray-400'
          }
        `}
      >
        {placeholder}
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 