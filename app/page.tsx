'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Header from './components/Header';

export default function Home() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      router.push('/notes');
    }
  }, [user, router]);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto py-10 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to Note Online App</h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Your personal note-taking application. Create, edit, and organize your notes all in one place.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/register')}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Register
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}