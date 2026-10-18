"use client";

import React from 'react';
import { useAnalytics } from './AnalyticsProvider';

interface TrackedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  eventType: string;
}

export const TrackedLink: React.FC<TrackedLinkProps> = ({ eventType, onClick, children, ...props }) => {
  const { track } = useAnalytics();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    track(eventType);
    if (onClick) onClick(e);
  };

  return (
    <a onClick={handleClick} {...props}>
      {children}
    </a>
  );
};
