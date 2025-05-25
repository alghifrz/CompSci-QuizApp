import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    console.log('Received quiz attempt request');
    
    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (!session?.user?.email) {
      console.log('No session or email found');
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('Request body:', body);

    const { score, correctAnswers, wrongAnswers, timeSpent } = body;

    // Validate input
    if (typeof score !== 'number' || 
        typeof correctAnswers !== 'number' || 
        typeof wrongAnswers !== 'number' || 
        typeof timeSpent !== 'number') {
      console.log('Invalid input data:', { score, correctAnswers, wrongAnswers, timeSpent });
      return NextResponse.json(
        { message: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.log('User not found for email:', session.user.email);
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Creating quiz attempt for user:', user.id);

    // Create quiz attempt
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        score,
        correctAnswers,
        wrongAnswers,
        timeSpent,
      },
    });

    console.log('Quiz attempt created successfully:', quizAttempt);

    return NextResponse.json(
      { message: 'Quiz attempt saved successfully', quizAttempt },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 