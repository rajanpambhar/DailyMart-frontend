import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8", ...props }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Handle - Moved before Bag Body to appear behind */}
      <path
        d="M11 10V7C11 4.23858 13.2386 2 16 2C18.7614 2 21 4.23858 21 7V10"
        className="stroke-secondary-400"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Bag Body */}
      <path
        d="M6 10H26L24.5 26C24.3333 27.6667 23.5 29 21.5 29H10.5C8.5 29 7.66667 27.6667 7.5 26L6 10Z"
        className="fill-primary-500"
      />
      
      {/* Leaf - Symbolizing Freshness */}
      <path
        d="M16 14C16 14 18 12 21 13C21 13 22 15 19 18C19 18 16 19 14 16L16 14Z"
        className="fill-white/30"
      />
      
      {/* Smile/Curve detail */}
      <path
        d="M11 18C11 18 13 21 16 21C19 21 21 18 21 18"
        className="stroke-dark-900/20"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Logo;
