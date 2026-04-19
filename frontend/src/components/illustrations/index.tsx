'use client';

import React from 'react';

// Angola Flag SVG Component
export function AngolaFlag({ className = "w-12 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="640" height="480" fill="#CC092F" />
      <rect x="320" width="320" height="480" fill="black" />
      <circle cx="210" cy="240" r="80" fill="#FFCC00" />
    </svg>
  );
}

// Angola Pattern SVG Component  
export function AngolaPattern({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="angola-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#angola-pattern)" />
    </svg>
  );
}

// Angola Emblem SVG Component
export function AngolaEmblem({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
      <path d="M50 20 L55 35 L70 35 L58 45 L62 60 L50 50 L38 60 L42 45 L30 35 L45 35 Z" fill="currentColor" />
    </svg>
  );
}

// Palanca Negra (Antelope) SVG Component
export function PalancaNegra({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 70 L40 50 L50 55 L60 50 L70 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M35 70 Q50 85 65 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="40" r="10" stroke="currentColor" strokeWidth="3" />
      <path d="M20 45 L35 40" stroke="currentColor" strokeWidth="2" />
      <path d="M80 45 L65 40" stroke="currentColor" strokeWidth="2" />
      <path d="M45 30 L50 20 L55 30" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// Angola Map SVG Component
export function AngolaMap({ className = "w-full h-64" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 100 L150 80 L250 100 L300 150 L320 250 L280 350 L180 380 L80 350 L40 250 L50 100 Z" 
        stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M100 150 L150 140 L200 160" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M200 200 L250 190 L280 220" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="150" cy="150" r="5" fill="currentColor" opacity="0.7" />
      <circle cx="250" cy="180" r="5" fill="currentColor" opacity="0.7" />
      <circle cx="200" cy="280" r="5" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

// Justice Illustration with scales
export function JusticeIllustration({ 
  variant = "hero", 
  className = "w-full" 
}: { 
  variant?: "hero" | "scales";
  className?: string;
}) {
  if (variant === "scales") {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10 L50 30" stroke="currentColor" strokeWidth="3" />
        <path d="M30 30 L70 30" stroke="currentColor" strokeWidth="3" />
        <path d="M35 30 L35 60" stroke="currentColor" strokeWidth="2" />
        <path d="M65 30 L65 60" stroke="currentColor" strokeWidth="2" />
        <path d="M25 60 L45 60" stroke="currentColor" strokeWidth="2" />
        <path d="M55 60 L75 60" stroke="currentColor" strokeWidth="2" />
        <circle cx="35" cy="65" r="8" stroke="currentColor" strokeWidth="2" />
        <circle cx="65" cy="65" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M50 30 L50 90" stroke="currentColor" strokeWidth="2" />
        <path d="M30 90 L70 90" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  // Default hero variant
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="100" cy="100" r="90" fill="#F3F4F6" />
      
      {/* Scales */}
      <rect x="95" y="20" width="10" height="30" fill="#6B7280" />
      <rect x="60" y="50" width="80" height="5" fill="#6B7280" />
      
      {/* Left pan */}
      <path d="M65 55 L65 80 Q65 90 75 90 L85 90 Q95 90 95 80 L95 55" stroke="#6B7280" strokeWidth="3" fill="none" />
      
      {/* Right pan */}
      <path d="M105 55 L105 80 Q105 90 115 90 L125 90 Q135 90 135 80 L135 55" stroke="#6B7280" strokeWidth="3" fill="none" />
      
      {/* Base */}
      <rect x="85" y="90" width="30" height="60" rx="5" fill="#374151" />
      <rect x="70" y="150" width="60" height="10" rx="2" fill="#1F2937" />
      
      {/* Document */}
      <rect x="145" y="60" width="35" height="45" rx="2" fill="white" stroke="#D1D5DB" strokeWidth="2" />
      <line x1="150" y1="70" x2="175" y2="70" stroke="#D1D5DB" strokeWidth="1" />
      <line x1="150" y1="78" x2="170" y2="78" stroke="#D1D5DB" strokeWidth="1" />
      <line x1="150" y1="86" x2="175" y2="86" stroke="#D1D5DB" strokeWidth="1" />
    </svg>
  );
}

export default {
  AngolaFlag,
  AngolaPattern,
  AngolaEmblem,
  PalancaNegra,
  AngolaMap,
  JusticeIllustration,
};
