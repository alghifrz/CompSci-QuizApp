'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Input from '@/app/components/ui/Input';
import Card from '@/app/components/ui/Card';
import Link from 'next/link';
import AuthLayout from '@/app/components/layouts/AuthLayout';
import Button from '@/app/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Handle specific error messages
        switch (result.error) {
          case 'No user found':
            setError('Akun tidak ditemukan. Silakan periksa email Anda atau daftar terlebih dahulu.');
            break;
          case 'Invalid password':
            setError('Password yang Anda masukkan salah.');
            break;
          case 'Please sign in with Google':
            setError('Akun ini terdaftar dengan Google. Silakan login menggunakan Google.');
            break;
          default:
            setError('Terjadi kesalahan. Silakan coba lagi.');
        }
      } else {
        // Redirect to dashboard on success
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Sign in to your account"
    >
      <Card className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-right">
              <Link 
                href="/forgot-password" 
                className="text-sm font-medium text-purple-600 hover:text-purple-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </div>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-100 text-gray-500 font-medium">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-12 text-base"
          onClick={handleGoogleSignIn}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </div>
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link 
            href="/register" 
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Sign up
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
} 