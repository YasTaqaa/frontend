'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // During SSR or initial client render before hydration,
  // return the same structure as the children to avoid hydration mismatch
  if (!isClient) {
    return <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">Loading...</div>
      </div>
    </div>;
  }

  // After hydration, if no user, render nothing (we're redirecting)
  if (!user) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}