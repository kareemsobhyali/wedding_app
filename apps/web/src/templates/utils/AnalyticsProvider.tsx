"use client";

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { AnalyticsClient } from './analytics.client';

export const AnalyticsContext = createContext<{ track: (event: string) => void }>({ track: () => {} });

export const AnalyticsProvider: React.FC<{ slug: string, isPublic: boolean, children: React.ReactNode }> = ({ slug, isPublic, children }) => {
  const clientRef = useRef<AnalyticsClient>();
  const viewTracked = useRef(false);

  if (!clientRef.current) {
    clientRef.current = new AnalyticsClient(slug, isPublic);
  }

  useEffect(() => {
    if (isPublic && !viewTracked.current) {
      viewTracked.current = true;
      clientRef.current?.track('VIEW');
    }
  }, [isPublic]);

  return (
    <AnalyticsContext.Provider value={{ track: (e) => clientRef.current?.track(e) }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => useContext(AnalyticsContext);
