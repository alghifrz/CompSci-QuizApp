import React from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="w-full lg:w-1/2 flex flex-col p-4 sm:p-8 bg-gray-100">
        <div className="w-full">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={200} 
            height={200} 
          />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xl">
            <div className="mb-20 text-left">
              <h2 className="lg:text-4xl text-2xl font-extrabold text-gray-900">{title}</h2>
              <p className="mt-2 text-gray-600 font-normal">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
      
      {/* Right Side */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0">
          <Image
            src="/bg.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 flex items-center justify-center p-12 w-full">
          <div className="text-white pt-120 text-center">
            <h1 className="text-5xl font-extrabold mb-6 py-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Ready to be challenged?
            </h1>
            <p className="text-xl text-purple-300 opacity-80 font-light leading-relaxed tracking-wide">
              Test your knowledge in computer science, programming, and technology.
              Challenge yourself with our comprehensive quiz platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 