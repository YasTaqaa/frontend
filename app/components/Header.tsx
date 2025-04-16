'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/userSlice';
import { AppDispatch } from '../store';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const onLogout = async () => {
    await dispatch(logout());
    router.push('/login');
  };

  return (
    <header className="bg-indigo-600 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="font-bold text-2xl">
          <p className="text-white hover:text-indigo-200 transition">
            NoteOnline
          </p>
        </h1>
        
        <nav>
          <ul className="flex items-center space-x-6">
            {user ? (
              <>
                <li>
                  <Link
                    href="/notes"
                    className={`text-white hover:text-indigo-200 transition ${
                      pathname === '/notes' ? 'font-medium underline' : ''
                    }`}
                  >
                    My Notes
                  </Link>
                </li>
                <li>
                  <button
                    onClick={onLogout}
                    className="bg-white text-indigo-600 px-4 py-1 rounded-md hover:bg-indigo-100 transition"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className={`text-white hover:text-indigo-200 transition ${
                      pathname === '/login' ? 'font-medium underline' : ''
                    }`}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="bg-white text-indigo-600 px-4 py-1 rounded-md hover:bg-indigo-100 transition"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;