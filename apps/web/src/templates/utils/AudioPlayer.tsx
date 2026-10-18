"use client";

import React, { useRef, useState } from 'react';
import { useAnalytics } from './AnalyticsProvider';

interface AudioPlayerProps {
  url: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ url }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const { track } = useAnalytics();

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          track('MUSIC_PLAY');
        })
        .catch(() => setError(true));
    }
  };

  if (!url) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio 
        ref={audioRef} 
        src={url} 
        loop 
        onEnded={() => setIsPlaying(false)} 
        onError={() => setError(true)}
      />
      <button
        onClick={togglePlay}
        disabled={error}
        className="w-12 h-12 bg-white text-stone-800 rounded-full shadow-lg flex items-center justify-center hover:bg-stone-100 transition-transform hover:scale-105"
        aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
      >
        {error ? '❌' : isPlaying ? '⏸' : '🎵'}
      </button>
    </div>
  );
};
