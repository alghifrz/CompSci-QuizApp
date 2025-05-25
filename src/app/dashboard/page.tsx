'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import ModalQuiz from '../components/ui/ModalQuiz';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userStats, setUserStats] = useState({
    quizTaken: 0,
    avgScore: 0,
    highestScore: 0,
  });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Fetch user quiz attempts
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const res = await fetch('/api/quiz/attempts');
        if (!res.ok) throw new Error('Failed to fetch attempts');
        const data = await res.json();
        const attempts = data.attempts || [];
        const quizTaken = attempts.length;
        const avgScore = quizTaken > 0 ? Math.round(attempts.reduce((acc: number, a: any) => acc + a.score, 0) / quizTaken) : 0;
        const highestScore = quizTaken > 0 ? Math.max(...attempts.map((a: any) => a.score)) : 0;
        setUserStats({ quizTaken, avgScore, highestScore });
      } catch (e) {
        setUserStats({ quizTaken: 0, avgScore: 0, highestScore: 0 });
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    // Fetch leaderboard
    const fetchLeaderboard = async () => {
      setLoadingLeaderboard(true);
      try {
        const res = await fetch('/api/quiz/leaderboard');
        if (!res.ok) throw new Error('Failed to fetch leaderboard');
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      } catch (e) {
        setLeaderboard([]);
      } finally {
        setLoadingLeaderboard(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const handleStartQuiz = () => {
    setIsModalOpen(true);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Welcome Card */}
        <Card className="p-6 sm:p-8 bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 text-white relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="relative flex flex-col sm:flex-row items-center justify-between">
            <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Welcome, <span className="text-white">{session?.user?.name || 'User'}</span>!
              </h1>
              <p className="text-base sm:text-lg text-purple-100 max-w-2xl">
                Ready to test your computer science knowledge? <br/> 
                Read the rules below and start your quiz!
              </p>
              <Button
                onClick={handleStartQuiz}
                size="lg"
                className="h-10 sm:h-12 px-6 sm:px-8 text-base font-medium bg-white text-purple-900 hover:bg-purple-50"
              >
                Start Quiz Now
              </Button>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-purple-500/20 backdrop-blur-sm flex items-center justify-center border border-purple-500/20">
                <span className="text-2xl sm:text-3xl font-bold">
                  {(session?.user?.name || session?.user?.email || '?')[0].toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left: Quiz Rules */}
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8 bg-white rounded-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Quiz Rules</h2>
                  <p className="text-sm text-gray-500">Make sure to read all rules before starting</p>
                </div>
                <div className="hidden md:flex items-center space-x-2 text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Read carefully!</span>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {[
                  {
                    number: 1,
                    title: "20 Multiple Choice Questions",
                    description: "Each quiz consists of 20 multiple-choice questions about computer science topics. There are 4 options for each question."
                  },
                  {
                    number: 2,
                    title: "Time Limit",
                    description: "You have 10 minutes to complete each quiz. The timer will start as soon as you begin."
                  },
                  {
                    number: 3,
                    title: "Scoring System",
                    description: "Each correct answer earns you 10 points, and each wrong answer deducts 5 points."
                  },
                  {
                    number: 4,
                    title: "One Click Answer",
                    description: "Once you choose an answer, the quiz will automatically proceed to the next question."
                  },
                  {
                    number: 5,
                    title: "Leaderboard", 
                    description: "Your scores will be displayed on the leaderboard. If you get the same score with other participants, you will be ranked based on your time taken to complete the quiz."
                  },
                ].map((rule) => (
                  <div key={rule.number} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg hover:bg-purple-50 transition-colors group">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <span className="text-purple-600 font-bold">{rule.number}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-purple-900 transition-colors">{rule.title}</h3>
                      <p className="mt-1 text-gray-600 group-hover:text-gray-700 transition-colors">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          {/* Right: Progress and Leaderboard */}
          <div className="space-y-6 sm:space-y-8">
            {/* Progress Card */}
            <Card className="p-4 sm:p-6 bg-white rounded-2xl">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Your Progress</h3>
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {loadingStats ? (
                  <div className="text-center text-gray-400">Loading...</div>
                ) : (
                  [
                    { label: "Quizzes Taken", value: userStats.quizTaken },
                    { label: "Average Score", value: userStats.avgScore },
                    { label: "Highest Score", value: userStats.highestScore }
                  ].map((stat) => (
                    <div key={stat.label} className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-gray-600">{stat.label}</span>
                      <span className="font-bold text-purple-600">{stat.value}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>
            {/* Leaderboard Card (Top 3, not table) */}
            <Card className="p-4 sm:p-6 bg-white rounded-2xl">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Leaderboard (Top 3)</h3>
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              {loadingLeaderboard ? (
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
                <div className="space-y-3 sm:space-y-4">
                  {leaderboard.slice(0, 3).map((entry, idx) => (
                    <div key={entry.email} className="flex items-center justify-between p-3 sm:p-4 bg-purple-50 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-300' : 'bg-amber-600'}`}>{idx + 1}</div>
                        <span className="font-medium text-gray-900">{entry.name || '-'}</span>
                      </div>
                      <span className="font-bold text-purple-700 text-lg">{entry.score}</span>
                    </div>
                  ))}
                  <Button
                    onClick={() => router.push('/leaderboard')}
                    variant="outline"
                    className="w-full h-10 sm:h-12 text-base hover:bg-purple-50 hover:text-purple-900 mt-2"
                  >
                    View Full Leaderboard
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Quiz Confirmation Modal */}
        <ModalQuiz isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </div>
    </DashboardLayout>
  );
} 