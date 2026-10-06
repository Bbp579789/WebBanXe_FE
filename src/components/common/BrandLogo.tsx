import React from 'react';

export interface BrandLogoProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size || width || '100%'}
      height={size || height || '100%'}
      className={`stroke-current ${className}`}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20M12 12L3.5 7M12 12l8.5-5M12 12L4 18M12 12l8 6" />
    </svg>
  );
};

export default BrandLogo;