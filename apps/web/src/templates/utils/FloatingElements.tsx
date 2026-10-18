'use client';
import React, { useEffect, useState } from 'react';

interface FloatingElementsProps {
  type?: 'hearts' | 'petals' | 'stars' | 'gold-dust';
  count?: number;
  speed?: 'slow' | 'normal' | 'fast';
}

export const FloatingElements: React.FC<FloatingElementsProps> = ({ 
  type = 'hearts', 
  count = 15,
  speed = 'normal'
}) => {
  const [elements, setElements] = useState<any[]>([]);

  useEffect(() => {
    // Only generate on client to prevent hydration mismatch
    const newElements = Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * (type === 'gold-dust' ? 4 : 20) + (type === 'gold-dust' ? 2 : 10);
      return {
        id: i,
        left: Math.random() * 100,
        animationDuration: (Math.random() * 10 + (speed === 'slow' ? 15 : speed === 'fast' ? 5 : 10)),
        delay: Math.random() * 10,
        size,
        rotation: Math.random() * 360,
      };
    });
    setElements(newElements);
  }, [count, type, speed]);

  const getElementShape = () => {
    switch (type) {
      case 'hearts':
        return (
          <svg viewBox="0 0 32 29.6" fill="rgba(255, 105, 180, 0.4)">
            <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
            c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
          </svg>
        );
      case 'petals':
        // A simple rose petal shape
        return (
          <svg viewBox="0 0 30 30" fill="rgba(255, 192, 203, 0.6)">
            <path d="M15,0 C25,10 30,20 15,30 C0,20 5,10 15,0 Z"/>
          </svg>
        );
      case 'gold-dust':
        return <div className="w-full h-full bg-yellow-300 rounded-full shadow-[0_0_8px_rgba(255,215,0,0.8)]" />;
      case 'stars':
      default:
        return (
          <svg viewBox="0 0 51.6 49.3" fill="rgba(255, 215, 0, 0.5)">
            <polygon points="25.8,0 33.8,16.2 51.6,18.8 38.7,31.4 41.8,49.3 25.8,40.9 9.8,49.3 12.9,31.4 0,18.8 17.8,16.2 "/>
          </svg>
        );
    }
  };

  if (elements.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-up {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
        }
      `}} />
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute bottom-0"
          style={{
            left: `${el.left}%`,
            width: `${el.size}px`,
            height: `${el.size}px`,
            animation: `float-up ${el.animationDuration}s linear infinite`,
            animationDelay: `${el.delay}s`,
            transform: `rotate(${el.rotation}deg)`,
          }}
        >
          {getElementShape()}
        </div>
      ))}
    </div>
  );
}
