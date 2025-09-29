/**
 * Compact Mode Toggle Component
 * Provides a UI control for toggling compact mobile mode
 */

import React from 'react';
import { useCompactMobileMode } from '../../lib/hooks/useCompactMobileMode';

interface CompactModeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'switch' | 'icon';
}

export const CompactModeToggle: React.FC<CompactModeToggleProps> = ({
  className = '',
  showLabel = true,
  size = 'md',
  variant = 'button'
}) => {
  const {
    isCompactMode,
    isManualMode,
    toggleCompactMode,
    setCompactModeLevel,
    status
  } = useCompactMobileMode();

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  };

  const handleToggle = () => {
    toggleCompactMode();
  };

  const handleLevelChange = (level: 'normal' | 'smaller') => {
    setCompactModeLevel(level);
  };

  if (variant === 'switch') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showLabel && (
          <label className="text-sm font-medium">
            Compact Mode
          </label>
        )}
        <button
          onClick={handleToggle}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${isCompactMode ? 'bg-blue-600' : 'bg-gray-200'}
            ${sizeClasses[size]}
          `}
          aria-pressed={isCompactMode}
          aria-label="Toggle compact mode"
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${isCompactMode ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
        {isManualMode && (
          <div className="flex space-x-1">
            <button
              onClick={() => handleLevelChange('normal')}
              className={`px-2 py-1 text-xs rounded ${
                status.scaleFactor === 0.857 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => handleLevelChange('smaller')}
              className={`px-2 py-1 text-xs rounded ${
                status.scaleFactor === 0.8 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
              }`}
            >
              Smaller
            </button>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        className={`
          p-2 rounded-full transition-colors
          ${isCompactMode ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
          hover:bg-blue-200
          ${className}
        `}
        aria-label={isCompactMode ? 'Disable compact mode' : 'Enable compact mode'}
        title={isCompactMode ? 'Disable compact mode' : 'Enable compact mode'}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isCompactMode ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          )}
        </svg>
      </button>
    );
  }

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <button
        onClick={handleToggle}
        className={`
          inline-flex items-center justify-center rounded-md font-medium transition-colors
          ${isCompactMode 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }
          ${sizeClasses[size]}
        `}
        aria-pressed={isCompactMode}
      >
        {showLabel && (
          <span className="mr-2">
            {isCompactMode ? 'Disable' : 'Enable'} Compact Mode
          </span>
        )}
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isCompactMode ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          )}
        </svg>
      </button>
      
      {isManualMode && isCompactMode && (
        <div className="flex space-x-1">
          <button
            onClick={() => handleLevelChange('normal')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              status.scaleFactor === 0.857 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => handleLevelChange('smaller')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              status.scaleFactor === 0.8 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Smaller
          </button>
        </div>
      )}
    </div>
  );
};

export default CompactModeToggle;