import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../BrandLogo';

interface HeaderBrandProps {
  isSolid: boolean;
}

export const HeaderBrand: React.FC<HeaderBrandProps> = ({ isSolid }) => {
  return (
    <Link to="/" className="flex items-center gap-3.5 group cursor-pointer shrink-0 mx-4">
      {/* Vòng tròn bọc logo */}
      <div
        className={`h-10 w-10 rounded-full border border-[#b8955a] flex items-center justify-center p-1.5 text-[#b8955a] shrink-0 transition-transform group-hover:scale-105 shadow-inner ${
          isSolid ? 'bg-zinc-100' : 'bg-black/35 backdrop-blur-sm'
        }`}
      >
        <BrandLogo className="w-full h-full" />
      </div>

      <div className="hidden md:flex flex-col text-left">
        <span
          className={`text-xs font-semibold tracking-[0.22em] font-serif uppercase transition-colors duration-300 ${
            isSolid ? 'text-zinc-900' : 'text-white drop-shadow-md'
          }`}
        >
          Mercedes-Benz
        </span>
        <span className="text-[9px] tracking-[0.2em] text-[#b8955a] uppercase font-mono font-medium">
          Authorized Dealer Portal
        </span>
      </div>
    </Link>
  );
};