import { useAuth } from '@clerk/expo';
import { Redirect, Slot } from 'expo-router';
import { useEffect, useRef } from 'react';

export default function AppLayout() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!isSignedIn || hasSynced.current) return;
    hasSynced.current = true;

    (async () => {
      try {
        const token = await getToken();
        await fetch('/api/users/sync', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Not critical to navigation; the next sign-in will retry.
        hasSynced.current = false;
      }
    })();
  }, [isSignedIn, getToken]);

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/sign-in" />;

  return <Slot />;
}
