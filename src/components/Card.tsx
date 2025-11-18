import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Card = ({ children, title, className = '' }: CardProps) => {
  return (
    <div className={`bg-white rounded-2xl border border-stroke p-6 shadow-card ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-dark mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default Card;

