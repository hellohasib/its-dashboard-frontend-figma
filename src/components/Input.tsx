import React from 'react';
import { Search } from 'lucide-react';

interface InputProps {
  id?: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'date';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}

const Input = ({
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  className = '',
  required = false,
  disabled = false,
  autoComplete,
}: InputProps) => {
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-text dark:text-gray-400">
          {icon}
        </div>
      )}
      {type === 'search' && !icon && (
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-text dark:text-gray-400" />
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`w-full px-4 py-2 border border-stroke dark:border-gray-700 dark:bg-dark-dark3 rounded-lg text-sm text-dark dark:text-gray-200 placeholder-primary-text dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
          icon || type === 'search' ? 'pl-10' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800' : ''}`}
      />
    </div>
  );
};

export default Input;

