'use client';

import { useEffect, useState } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number;
  startOnView?: boolean;
  prefix?: string;
  suffix?: string;
}

export function useCountUp({
  end,
  duration = 1500,
  startOnView = true,
  prefix = '',
  suffix = '',
}: UseCountUpOptions) {
  const [count, setCount] = useState(startOnView ? 0 : end);
  const [hasStarted, setHasStarted] = useState(!startOnView);

  const start = () => {
    if (hasStarted) return;
    setHasStarted(true);
  };

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, end, duration]);

  const display = `${prefix}${count}${suffix}`;

  return { count, display, start };
}
