'use client';

import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { RenderMode } from '../types';
import { useAnalytics } from './AnalyticsProvider';

interface ShareWidgetProps {
  mode: RenderMode;
}

export const ShareWidget: React.FC<ShareWidgetProps> = ({ mode }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const { track } = useAnalytics();

  if (mode === 'PREVIEW') return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wedding Invitation',
          url: currentUrl
        });
        track('SHARE');
        return;
      } catch (err) {
        // Fallback to copy if user cancels or it fails
      }
    }
    
    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      track('SHARE');
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
      {showQR && (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100 mb-2 transition-all">
          <QRCode value={currentUrl} size={128} />
          <p className="text-xs text-center mt-2 text-gray-500">Scan to view</p>
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-stone-900 text-white shadow-lg text-sm rounded-full hover:bg-stone-800 transition-transform hover:scale-105"
        >
          {copied ? 'Copied!' : 'Share Invitation'}
        </button>
        <button
          onClick={() => setShowQR(!showQR)}
          className="w-9 h-9 flex items-center justify-center bg-white text-stone-900 border border-stone-200 shadow-lg rounded-full hover:bg-gray-50 transition-transform hover:scale-105"
          aria-label="Toggle QR Code"
        >
          QR
        </button>
      </div>
    </div>
  );
};
