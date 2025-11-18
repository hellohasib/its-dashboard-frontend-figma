import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}: ButtonProps) => {
  const baseStyles = 'rounded-lg font-medium transition-all duration-200';

  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-600 active:bg-blue-700',
    secondary: 'bg-gray-100 dark:bg-dark-dark3 text-dark dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600',
    outline: 'border border-stroke dark:border-gray-700 text-primary-text dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-dark3 active:bg-gray-100 dark:active:bg-gray-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

