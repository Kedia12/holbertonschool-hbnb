import React from 'react';
import { useState, useEffect } from 'react';

export const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin`} />
  );
};

export const ErrorAlert = ({ message, onClose }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex justify-between items-center">
    <span>{message}</span>
    {onClose && (
      <button onClick={onClose} className="text-red-500 hover:text-red-700">
        ✕
      </button>
    )}
  </div>
);

export const SuccessAlert = ({ message, onClose }) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 flex justify-between items-center">
    <span>{message}</span>
    {onClose && (
      <button onClick={onClose} className="text-green-500 hover:text-green-700">
        ✕
      </button>
    )}
  </div>
);

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
};

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

export const Input = ({ label, error, ...props }) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    )}
    <input
      {...props}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);

export const RatingStars = ({ rating, onChange, readOnly = false }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readOnly && onChange?.(star)}
          className={`text-2xl transition ${
            star <= rating ? 'text-amber-500' : 'text-gray-300'
          } ${!readOnly && 'hover:text-amber-400 cursor-pointer'}`}
          disabled={readOnly}
          type="button"
        >
          ★
        </button>
      ))}
    </div>
  );
};
