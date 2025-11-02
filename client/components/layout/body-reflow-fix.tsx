'use client';

import { useEffect } from 'react';

export function BodyReflowFix() {
  useEffect(() => {
    document.body.style.display = 'none';
    document.body.offsetHeight; // Force reflow
    document.body.style.display = '';

    if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
      window.dispatchEvent(new Event("resize"));
    }
  }, []);

  return null;
}
