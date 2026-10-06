import * as React from 'react';
import { cn } from '../../lib/utils';

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: 'logo' | 'cart' | 'menu' | 'user' | 'car' | 'logout';
}

export const Icon: React.FC<IconProps> = ({ name, className = '', ...props }) => {
  switch (name) {
    case 'logo':
      // Logo biểu tượng ngôi sao 3 cánh xe Mercedes
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className={cn('stroke-current', className)}
          {...props}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20M12 12L3.5 7M12 12l8.5-5M12 12L4 18M12 12l8 6" />
        </svg>
      );

    case 'cart':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn('stroke-current', className)}
          {...props}
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );

    case 'menu':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn('stroke-current', className)}
          {...props}
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      );

    case 'user':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn('stroke-current', className)} {...props}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );

    case 'car':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cn('stroke-current', className)} {...props}>
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11 2 11.5 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      );

    case 'logout':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn('stroke-current', className)} {...props}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );

    default:
      return null;
  }
};