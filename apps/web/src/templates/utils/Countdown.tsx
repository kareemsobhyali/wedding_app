"use client";

import React, { useEffect, useState } from 'react';

interface CountdownProps {
  date: Date | string;
  time?: string; // HH:mm
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
  isToday: boolean;
}

export function calculateTimeLeft(targetDate: Date | string, targetTime?: string): TimeLeft {
  const target = new Date(targetDate);
  if (targetTime) {
    const [hours, minutes] = targetTime.split(':').map(Number);
    if (!isNaN(hours)) target.setHours(hours, minutes || 0, 0, 0);
  }

  const now = new Date();
  const diff = target.getTime() - now.getTime();

  // Check if today
  const isToday = target.toDateString() === now.toDateString();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true, isToday };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isPassed: false,
    isToday
  };
}

export const Countdown: React.FC<CountdownProps> = ({ date, time }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(date, time));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(date, time));
    }, 1000);
    return () => clearInterval(timer);
  }, [date, time]);

  if (timeLeft.isPassed && !timeLeft.isToday) {
    return <div className="text-center italic opacity-70">Happily Ever After</div>;
  }

  if (timeLeft.isPassed && timeLeft.isToday) {
    return <div className="text-center font-bold text-xl uppercase tracking-widest">Today is the day!</div>;
  }

  return (
    <div className="flex justify-center gap-4 text-center">
      <div className="flex flex-col">
        <span className="text-3xl font-bold">{timeLeft.days}</span>
        <span className="text-xs uppercase tracking-widest opacity-70">Days</span>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold">{timeLeft.hours}</span>
        <span className="text-xs uppercase tracking-widest opacity-70">Hours</span>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold">{timeLeft.minutes}</span>
        <span className="text-xs uppercase tracking-widest opacity-70">Mins</span>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold">{timeLeft.seconds}</span>
        <span className="text-xs uppercase tracking-widest opacity-70">Secs</span>
      </div>
    </div>
  );
};
