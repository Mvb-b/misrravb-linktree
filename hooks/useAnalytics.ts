'use client';

import { useCallback } from 'react';

export function useAnalytics() {
  const trackClick = useCallback(async (platform: string, url: string) => {
    try {
      // Don't await, fire and forget for better UX
      fetch('/api/analytics/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform, url }),
        // Keepalive ensures request completes even if page unloads
        keepalive: true,
      }).catch(err => {
        // Silent fail - don't break user experience
        console.debug('Analytics tracking failed:', err);
      });
    } catch (error) {
      // Silent fail
      console.debug('Analytics error:', error);
    }
  }, []);

  return { trackClick };
}
