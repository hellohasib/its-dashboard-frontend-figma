import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Card = ({ children, title, className = '' }: CardProps) => {
  return (
    <div className={`bg-white dark:bg-dark dark:border-gray-700 rounded-2xl border border-stroke p-6 shadow-card transition-colors ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-dark dark:text-gray-200 mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default Card;

