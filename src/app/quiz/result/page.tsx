'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';

interface QuizAttempt {
  id: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  completedAt: string;
}

export default function ResultPage() {
  const router = useRouter();
  const { status } = useSession();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await fetch('/api/quiz/attempts');
        if (!response.ok) {
          throw new Error('Failed to fetch quiz attempts');
        }
        const data = await response.json();
        setAttempts(data.attempts);
      } catch (error) {
        console.error('Error fetching attempts:', error);
        setError('Failed to load quiz history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const latestAttempt = attempts[0];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Latest Attempt Summary */}
        <Card className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quiz Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <span className="text-gray-600">Score</span>
                <span className="text-2xl font-bold text-purple-600">{latestAttempt?.score || 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <span className="text-gray-600">Correct Answers</span>
                <span className="text-2xl font-bold text-green-600">{latestAttempt?.correctAnswers || 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <span className="text-gray-600">Wrong Answers</span>
                <span className="text-2xl font-bold text-red-600">{latestAttempt?.wrongAnswers || 0}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <span className="text-gray-600">Time Spent</span>
                <span className="text-2xl font-bold text-blue-600">
                  {latestAttempt ? formatTime(latestAttempt.timeSpent) : '0:00'}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Attempts</span>
                <span className="text-2xl font-bold text-gray-600">{attempts.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Last Attempt</span>
                <span className="text-sm text-gray-600">
                  {latestAttempt ? formatDate(latestAttempt.completedAt) : 'No attempts yet'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Attempt History */}
        {attempts.length > 1 && (
          <Card className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Attempt History</h3>
            <div className="space-y-4">
              {attempts.slice(1).map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-500 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 font-medium">
                      {attempt.score}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{formatDate(attempt.completedAt)}</div>
                      <div className="text-sm text-gray-600">
                        {attempt.correctAnswers} correct, {attempt.wrongAnswers} wrong
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatTime(attempt.timeSpent)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={() => router.push('/quiz')}
          >
            Try Again
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
} 