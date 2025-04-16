'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { login, resetAuthState } from '../store/userSlice';

import Header from '../components/Header';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state: RootState) => state.auth
  );

  const { email, password } = formData;

  useEffect(() => {
    if (isSuccess || user) {
      router.push('/notes');
    }

    return () => {
      dispatch(resetAuthState());
    };
  }, [user, isSuccess, router, dispatch]);

  const validateForm = () => {
    let isValid = true;
    const errors = { email: '', password: '' };

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    }

    // Untuk testing, nonaktifkan validasi format email:
    // else if (!/\S+@\S+\.\S+/.test(email)) {
    //   errors.email = 'Email is invalid';
    //   isValid = false;
    // }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto py-10 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          {isError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          <form onSubmit={onSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="text" // dari "email" diganti ke "text" agar input bebas
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {validationErrors.password && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Dont have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
