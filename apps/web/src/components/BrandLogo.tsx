'use client';

import React from 'react';

export type LogoVariant = 'royal-crown' | 'monogram-wreath' | 'palace-arch' | 'modern-minimal';

interface BrandLogoProps {
  variant?: LogoVariant;
  siteName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export function BrandLogoIcon({ variant = 'royal-crown', className = "w-10 h-10" }: { variant?: LogoVariant; className?: string }) {
  if (variant === 'royal-crown') {
    // Option 1: Royal Crown & Entwined Wedding Rings
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gold-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFBA73" />
            <stop offset="50%" stopColor="#C5A059" />
            <stop offset="100%" stopColor="#8C6D38" />
          </linearGradient>
          <filter id="glow-1" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#C5A059" floodOpacity="0.4" />
          </filter>
        </defs>
        {/* Outer subtle halo ring */}
        <circle cx="24" cy="24" r="22" stroke="url(#gold-grad-1)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
        {/* Left Ring */}
        <circle cx="20" cy="27" r="9" stroke="url(#gold-grad-1)" strokeWidth="2.5" filter="url(#glow-1)" />
        {/* Right Ring */}
        <circle cx="28" cy="27" r="9" stroke="url(#gold-grad-1)" strokeWidth="2.5" filter="url(#glow-1)" />
        {/* Crown on top */}
        <path d="M16 19L20 13L24 17L28 13L32 19H16Z" fill="url(#gold-grad-1)" />
        {/* Sparkle star at apex */}
        <path d="M24 8L25 10.5L27.5 11.5L25 12.5L24 15L23 12.5L20.5 11.5L23 10.5L24 8Z" fill="#FFF8E7" />
        <circle cx="24" cy="11.5" r="1.5" fill="url(#gold-grad-1)" />
      </svg>
    );
  }

  if (variant === 'monogram-wreath') {
    // Option 2: Royal Arabic Monogram "د" with Olive / Floral Laurel Wreath
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gold-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3DCAC" />
            <stop offset="50%" stopColor="#C5A059" />
            <stop offset="100%" stopColor="#7E5D2A" />
          </linearGradient>
        </defs>
        {/* Laurel Wreath Left */}
        <path d="M12 28C11 20 16 12 24 10" stroke="url(#gold-grad-2)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 22C9 20 9 17 11 15C13 17 13 20 11 22Z" fill="url(#gold-grad-2)" />
        <path d="M14 16C13 14 14 11 16 10C17 12 17 15 14 16Z" fill="url(#gold-grad-2)" />
        {/* Laurel Wreath Right */}
        <path d="M36 28C37 20 32 12 24 10" stroke="url(#gold-grad-2)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M37 22C39 20 39 17 37 15C35 17 35 20 37 22Z" fill="url(#gold-grad-2)" />
        <path d="M34 16C35 14 34 11 32 10C31 12 31 15 34 16Z" fill="url(#gold-grad-2)" />
        {/* Artistic Calligraphic "د" */}
        <path d="M28 17C26 17 22 18 20 22C18.5 25 18 28 20 30C21.5 31.5 25 32 29 32" stroke="url(#gold-grad-2)" strokeWidth="3" strokeLinecap="round" />
        {/* Small Diamond Accent */}
        <circle cx="28" cy="18" r="2" fill="url(#gold-grad-2)" />
      </svg>
    );
  }

  if (variant === 'palace-arch') {
    // Option 3: Grand Royal Palace Arch & Diamond Sparkle
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gold-grad-3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFBA73" />
            <stop offset="50%" stopColor="#C5A059" />
            <stop offset="100%" stopColor="#6E4E26" />
          </linearGradient>
        </defs>
        {/* Grand Palace Arch Outline */}
        <path d="M13 38V22C13 15.9249 17.9249 11 24 11C30.0751 11 35 15.9249 35 22V38" stroke="url(#gold-grad-3)" strokeWidth="2" strokeLinecap="round" />
        {/* Inner Arch */}
        <path d="M17 38V24C17 20.134 20.134 17 24 17C27.866 17 31 20.134 31 24V38" stroke="url(#gold-grad-3)" strokeWidth="1.2" strokeDasharray="2 2" />
        {/* Center Chandelier / Heart Diamond */}
        <path d="M24 23L27 27H21L24 23Z" fill="url(#gold-grad-3)" />
        <path d="M24 27L21 27L24 32L27 27Z" fill="url(#gold-grad-3)" opacity="0.85" />
        {/* Base Steps */}
        <line x1="10" y1="38" x2="38" y2="38" stroke="url(#gold-grad-3)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Option 4: Modern Haute Minimalist (Cartier/Tiffany Style Double Diamonds)
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gold-grad-4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C5A059" />
          <stop offset="100%" stopColor="#38260F" />
        </linearGradient>
      </defs>
      {/* Outer Diamond */}
      <rect x="24" y="6" width="25" height="25" rx="5" transform="rotate(45 24 6)" stroke="url(#gold-grad-4)" strokeWidth="2" />
      {/* Inner Heart Sparkle */}
      <circle cx="24" cy="24" r="5" fill="#C5A059" />
      <path d="M24 14V34M14 24H34" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export default function BrandLogo({
  variant = 'royal-crown',
  siteName = "دعوتي Daawati",
  size = 'md',
  showSubtitle = true,
  className = ""
}: BrandLogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const textSizes = {
    sm: "text-lg sm:text-xl",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
    xl: "text-3xl sm:text-4xl"
  };

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Logo Icon Box with Luxury Glassy Background */}
      <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-[#8C6D38]/20 via-[#DFBA73]/30 to-[#8C6D38]/10 border border-[#DFBA73]/40 shadow-xs group-hover:scale-105 transition-all duration-300">
        <BrandLogoIcon variant={variant} className={iconSizes[size]} />
      </div>

      {/* Typography */}
      <div className="flex flex-col text-right">
        <span 
          className={`font-black ${textSizes[size]} text-[#38260F] tracking-tight leading-none group-hover:text-[#8C6D38] transition-colors`}
          style={{ fontFamily: "'Aref Ruqaa', 'Cairo', serif" }}
        >
          {siteName}
        </span>
        {showSubtitle && (
          <span className="text-[9px] sm:text-[10px] text-[#8C6D38] font-extrabold tracking-widest mt-0.5 uppercase opacity-90">
            Luxury Digital Invitations
          </span>
        )}
      </div>
    </div>
  );
}
