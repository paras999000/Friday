import React from 'react';

interface FIRDAYLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const FIRDAYLogo: React.FC<FIRDAYLogoProps> = ({
  className = '',
  size = 'md',
  animated = true,
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-wider select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Futuristic geometric hexagon / chip icon */}
        <svg
          className={`${iconSizes[size]} text-firday-cyan`}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-90"
          />
          <path
            d="M16 8L22 11.5V18.5L16 22L10 18.5V11.5L16 8Z"
            stroke="#8B5CF6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-80"
          />
          <circle cx="16" cy="15" r="2.5" fill="#00F0FF" />
          {/* Subtle circuit traces */}
          <path d="M16 2V8" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
          <path d="M16 22V30" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
          <path d="M4 9L10 12.5" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
          <path d="M28 23L22 19.5" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
        </svg>

        {animated && (
          <span className="absolute w-2 h-2 rounded-full bg-firday-cyan animate-ping opacity-60" />
        )}
      </div>

      <div className="flex flex-col">
        <span className={`font-mono font-extrabold tracking-widest text-white ${sizeClasses[size]}`}>
          FIR<span className="text-firday-cyan">DAY</span>
        </span>
      </div>
    </div>
  );
};
