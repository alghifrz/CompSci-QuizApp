import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface LeaderboardEntry {
  name: string | null;
  email: string | null;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  score: number;
  completedAt: Date;
}

type QuizAttempt = {
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  score: number;
  completedAt: Date;
};

type UserWithAttempts = {
  name: string | null;
  email: string | null;
  quizAttempts: QuizAttempt[];
};

export async function GET() {
  try {
    // Get all users with all their quiz attempts
    const users = await prisma.user.findMany({
      include: {
        quizAttempts: true,
      },
    });

    // For each user, find their highest score attempt (if tie, pick fastest time)
    let leaderboard: LeaderboardEntry[] = (users as UserWithAttempts[])
      .map((user) => {
        if (!user.quizAttempts || user.quizAttempts.length === 0) return null;
        // Find highest score, then fastest time
        const bestAttempt = user.quizAttempts.reduce((best: QuizAttempt | null, curr: QuizAttempt) => {
          if (!best) return curr;
          if (curr.score > best.score) return curr;
          if (curr.score === best.score && curr.timeSpent < best.timeSpent) return curr;
          return best;
        }, null as QuizAttempt | null);
        if (!bestAttempt) return null;
        return {
          name: user.name,
          email: user.email,
          correctAnswers: bestAttempt.correctAnswers,
          wrongAnswers: bestAttempt.wrongAnswers,
          timeSpent: bestAttempt.timeSpent,
          score: bestAttempt.score,
          completedAt: bestAttempt.completedAt,
        };
      })
      .filter(Boolean) as LeaderboardEntry[];

    leaderboard = leaderboard
      .sort((a, b) => {
        // Sort by score desc, then by timeSpent asc
        if (b.score !== a.score) return b.score - a.score;
        return a.timeSpent - b.timeSpent;
      })
      .slice(0, 10);

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 