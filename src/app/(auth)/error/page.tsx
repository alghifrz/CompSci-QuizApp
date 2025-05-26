'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/app/components/layouts/AuthLayout';
import Card from '@/app/components/ui/Card';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'OAuthAccountNotLinked':
        return 'Email sudah terdaftar dengan metode login yang berbeda. Silakan login dengan metode yang sama dengan pendaftaran Anda.';
      case 'AccessDenied':
        return 'Akses ditolak. Silakan coba lagi.';
      case 'Verification':
        return 'Link verifikasi tidak valid atau sudah kadaluarsa.';
      default:
        return 'Terjadi kesalahan. Silakan coba lagi.';
    }
  };

  return (
    <AuthLayout
      title="Oops!"
      subtitle="Terjadi kesalahan saat login"
    >
      <Card className="space-y-6">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            {getErrorMessage(error)}
          </div>
          <Link 
            href="/login" 
            className="text-purple-600 hover:text-purple-500 font-medium"
          >
            Kembali ke halaman login
          </Link>
        </div>
      </Card>
    </AuthLayout>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
} 