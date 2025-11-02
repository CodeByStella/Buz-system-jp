'use client';

import { useEffect } from 'react';

export function BodyReflowFix() {
  useEffect(() => {
    document.body.style.display = 'none';
    document.body.offsetHeight; // Force reflow
    document.body.style.display = '';
  }, []);

  return null;
}
