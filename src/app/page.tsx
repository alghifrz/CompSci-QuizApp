'use client'

import Link from 'next/link';
import Image from 'next/image';
import Footer from './components/layouts/Footer';
import Button from './components/ui/Button';
import { useEffect, useState } from 'react';
import Card from './components/ui/Card';


export default function HomePage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/quiz/leaderboard');
        if (!res.ok) throw new Error('Failed to fetch leaderboard');
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      } catch (e) {
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-white to-indigo-100">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center flex-1 py-12 sm:py-24 px-4 text-center">
        <Image src="/logo.png" alt="QuizApp Logo" width={400} height={400} className="mx-auto mb-4 sm:mb-6" />
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-xl mx-auto">
          Test your computer science knowledge with fun, challenging, and interactive quizzes.
        </p>
        <Link href="/login">
          <Button className="px-6 sm:px-8 py-4 sm:py-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-base sm:text-lg font-semibold shadow-md hover:scale-105 hover:from-purple-700 hover:to-indigo-700 transition-all">
            Get Started
          </Button>
        </Link>
      </header>

      {/* Features Section */}
      <section className="max-w-4xl mx-auto py-8 sm:py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          <svg className="w-10 h-10 text-purple-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 0C7.582 4 4 7.582 4 12s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" />
          </svg>
          <h3 className="font-bold text-base mb-1 text-gray-900">Challenging Questions</h3>
          <p className="text-gray-500 text-sm">Hundreds of curated computer science questions to test and expand your knowledge.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          <svg className="w-10 h-10 text-indigo-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h3m-7 4v2a4 4 0 004 4h3m-7-4H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3" />
          </svg>
          <h3 className="font-bold text-base mb-1 text-gray-900">Leaderboard & Progress</h3>
          <p className="text-gray-500 text-sm">Track your progress, see your ranking, and compete with others on the leaderboard.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          <svg className="w-10 h-10 text-pink-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h3 className="font-bold text-base mb-1 text-gray-900">Fun & Interactive</h3>
          <p className="text-gray-500 text-sm">Enjoy a smooth, interactive quiz experience with instant feedback and beautiful UI.</p>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="max-w-3xl mx-auto py-6 sm:py-8 px-4 text-center">
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6 sm:p-8 shadow-md">
          <blockquote className="text-xl sm:text-2xl italic text-gray-700 mb-4">"Learning is more effective when it&apos;s fun. Challenge yourself and see how far you can go!"</blockquote>
          <div className="flex items-center justify-center gap-2">
            <span className="font-semibold text-gray-900">&apos;&apos;Anonymous&apos;&apos;</span>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="max-w-2xl mx-auto py-6 sm:py-8 px-4 w-full">
        <Card className="p-4 sm:p-6 bg-white rounded-2xl">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Leaderboard (Top 3)</h3>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600">Belum ada user yang mengikuti quiz</p>
              <p className="text-sm text-gray-500 mt-1">Jadilah yang pertama!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.slice(0, 3).map((entry, idx) => (
                <div key={entry.email} className="flex items-center justify-between p-3 sm:p-4 bg-purple-50 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-300' : 'bg-amber-600'}`}>{idx + 1}</div>
                    <span className="font-medium text-gray-900">{entry.name || '-'}</span>
                  </div>
                  <span className="font-bold text-purple-700 text-lg">{entry.score}</span>
                </div>
              ))}
              <Link href="/leaderboard">
                <Button
                  variant="outline"
                  className="w-full h-12 text-base hover:bg-purple-50 hover:text-purple-900 mt-2"
                >
                  View Full Leaderboard
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
} 