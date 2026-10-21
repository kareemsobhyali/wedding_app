'use client';

import React from 'react';

interface BrandLogoProps {
  siteName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  variant?: string;
}

export default function BrandLogo({
  siteName = "Daawati • دعوتي",
  size = 'md',
  showSubtitle = true,
  className = ""
}: BrandLogoProps) {
  const imageSizes = {
    sm: "w-9 h-9 sm:w-10 sm:h-10",
    md: "w-11 h-11 sm:w-12 sm:h-12",
    lg: "w-14 h-14 sm:w-16 sm:h-16",
    xl: "w-20 h-20 sm:w-24 sm:h-24"
  };

  const textSizes = {
    sm: "text-base sm:text-lg",
    md: "text-lg sm:text-xl",
    lg: "text-xl sm:text-2xl",
    xl: "text-2xl sm:text-3xl"
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* Official 3D Luxury Logo Emblem */}
      <div className="relative shrink-0 p-0.5 rounded-2xl bg-gradient-to-tr from-[#8C6D38] via-[#DFBA73] to-[#8C6D38] shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
        <div className={`overflow-hidden rounded-[14px] bg-[#FAF7F2] ${imageSizes[size]}`}>
          <img 
            src="/assets/branding/daawati-logo.jpg" 
            alt="Daawati - دعوتك بطريقتك" 
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Typography & Official Tagline */}
      <div className="flex flex-col text-right">
        <span 
          className={`font-black ${textSizes[size]} text-[#38260F] tracking-tight leading-tight group-hover:text-[#8C6D38] transition-colors`}
          style={{ fontFamily: "'Aref Ruqaa', 'Cairo', serif" }}
        >
          {siteName}
        </span>
        {showSubtitle && (
          <span className="text-[10px] sm:text-[11px] text-[#8C6D38] font-extrabold tracking-wide mt-0.5">
            دعوتك ... بطريقتك ✨
          </span>
        )}
      </div>
    </div>
  );
}
