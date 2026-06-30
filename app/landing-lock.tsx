'use client';

import { useEffect } from 'react';

export function LandingLock() {
  useEffect(() => {
    document.body.classList.add('landing');
    return () => { document.body.classList.remove('landing'); };
  }, []);
  return null;
}
