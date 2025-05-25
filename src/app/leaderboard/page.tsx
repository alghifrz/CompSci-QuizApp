'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <Button variant="outline" onClick={() => router.push('/dashboard')} className="hidden sm:inline-flex">Back to Dashboard</Button>
        </div>
        <Card className="p-6">
          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600">Belum ada user yang mengikuti quiz</p>
              <p className="text-sm text-gray-500 mt-1">Jadilah yang pertama!</p>
            </div>
          ) : (
            <>
              {/* Mobile Card List */}
              <div className="block sm:hidden space-y-4">
                {leaderboard.map((entry, idx) => {
                  let badgeColor = idx === 0 ? 'bg-yellow-400 text-white' : idx === 1 ? 'bg-gray-300 text-white' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-700';
                  return (
                    <div key={entry.email} className="flex items-center p-4 rounded-xl bg-purple-50 shadow-sm">
                      <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center font-bold mr-3 ${badgeColor}`}>{idx + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{entry.name || '-'}</div>
                        <div className="text-xs text-gray-500 truncate">{entry.email || '-'}</div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                          <span className="text-xs text-purple-700 font-bold">Score: {entry.score}</span>
                          <span className="text-xs text-gray-700">Time: {entry.timeSpent}s</span>
                          <span className="text-xs text-gray-500">{entry.createdAt ? new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-100 mt-2">
                <table className="min-w-full text-sm text-left">
                  <thead className="sticky top-0 z-10 bg-purple-50">
                    <tr>
                      <th className="px-4 py-2 font-semibold text-gray-700">#</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Correct</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Wrong</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Time (s)</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, idx) => {
                      let rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                      let rankColor = '';
                      if (idx === 0) rankColor = 'bg-yellow-400 text-white';
                      else if (idx === 1) rankColor = 'bg-gray-300 text-white';
                      else if (idx === 2) rankColor = 'bg-amber-600 text-white';
                      return (
                        <tr key={entry.email} className={`${rowBg} hover:bg-purple-50 transition-colors`}>
                          <td className="px-4 py-2 font-bold">
                            <span className={`inline-block w-8 h-8 rounded-full text-center leading-8 font-bold ${rankColor}`}>{idx + 1}</span>
                          </td>
                          <td className="px-4 py-2 font-medium text-gray-900">{entry.name || '-'}</td>
                          <td className="px-4 py-2 text-gray-600">{entry.email || '-'}</td>
                          <td className="px-4 py-2 text-green-600 font-semibold">{entry.correctAnswers}</td>
                          <td className="px-4 py-2 text-red-600 font-semibold">{entry.wrongAnswers}</td>
                          <td className="px-4 py-2">{entry.timeSpent}</td>
                          <td className="px-4 py-2 font-bold text-lg">
                            <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow">
                              {entry.score}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
        {/* Back to Dashboard button for mobile */}
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="block sm:hidden w-full mt-6"
        >
          Back to Dashboard
        </Button>
      </div>
    </DashboardLayout>
  );
} 