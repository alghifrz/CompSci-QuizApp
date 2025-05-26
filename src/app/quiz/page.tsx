'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import Card from '@/app/components/ui/Card';
import { Button } from '@/components/ui/button';

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  allAnswers: string[];
}

export default function QuizPage() {
  const router = useRouter();
  const { status } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Restore state if available
    const savedQuestions = localStorage.getItem('quizQuestions');
    const savedState = localStorage.getItem('quizState');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
      setIsLoading(false);
      if (savedState) {
        const state = JSON.parse(savedState);
        setCurrentQuestion(state.currentQuestion || 0);
        setScore(state.score || 0);
        setCorrectAnswers(state.correctAnswers || 0);
        setWrongAnswers(state.wrongAnswers || 0);
        setStartTime(state.startTime || Date.now());
        setTimeLeft(state.timeLeft || 600);
      }
      return;
    }
    const fetchQuestions = async (retryCount = 0) => {
      try {
        setIsLoading(true);
        setError(null);
        if (retryCount > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
        const response = await fetch(
          'https://opentdb.com/api.php?amount=20&category=18&difficulty=hard&type=multiple',
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          }
        );
        if (response.status === 429) {
          if (retryCount < 3) {
            console.log(`Rate limited. Retrying in ${retryCount + 1} seconds...`);
            return fetchQuestions(retryCount + 1);
          } else {
            throw new Error('Too many requests. Please wait a moment and try again.');
          }
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.response_code === 0 && data.results && data.results.length > 0) {
          const decodedQuestions = data.results.map((q: Question) => {
            const decodedQuestion = {
              ...q,
              question: decodeHTMLEntities(q.question),
              correct_answer: decodeHTMLEntities(q.correct_answer),
              incorrect_answers: q.incorrect_answers.map((a: string) => decodeHTMLEntities(a))
            };
            const allAnswers = [
              decodedQuestion.correct_answer,
              ...decodedQuestion.incorrect_answers
            ].sort(() => Math.random() - 0.5);
            return {
              ...decodedQuestion,
              allAnswers
            };
          });
          localStorage.setItem('quizQuestions', JSON.stringify(decodedQuestions));
          setQuestions(decodedQuestions);
        } else {
          throw new Error('No questions available. Please try again.');
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load questions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setStartTime(Date.now());
    }
  }, [questions]);

  // Helper function to decode HTML entities
  const decodeHTMLEntities = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const handleQuizEnd = useCallback(async (isTimeUp = false) => {
    try {
      const timeSpent = isTimeUp ? 600 : Math.floor((Date.now() - startTime) / 1000);
      localStorage.removeItem('quizQuestions');
      localStorage.removeItem('quizState');
      
      console.log('Saving quiz attempt with data:', {
        score,
        correctAnswers,
        wrongAnswers,
        timeSpent,
      });
      
      // Save quiz attempt
      const response = await fetch('/api/quiz/attempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score,
          correctAnswers,
          wrongAnswers,
          timeSpent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(`Failed to save quiz attempt: ${errorData.message}`);
      }

      const result = await response.json();
      console.log('Quiz attempt saved successfully:', result);

      // Redirect to result page
      router.push('/quiz/result');
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
      setError('Failed to save quiz results. Please try again.');
    }
  }, [score, correctAnswers, wrongAnswers, startTime, router]);

  useEffect(() => {
    if (timeLeft > 0 && questions.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleQuizEnd(true);
    }
  }, [timeLeft, questions, handleQuizEnd]);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return; // Prevent multiple selections

    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].correct_answer;
    
    if (isCorrect) {
      setScore((prev) => prev + 10);
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setScore((prev) => (prev - 5));
      setWrongAnswers((prev) => prev + 1);
    }

    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        handleQuizEnd();
      }
    }, 1000);
  };

  const handleSkip = () => {
    // Move to next question immediately
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      handleQuizEnd();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Persist state to localStorage on change
  useEffect(() => {
    if (questions.length === 0) return;
    const state = {
      currentQuestion,
      score,
      correctAnswers,
      wrongAnswers,
      startTime,
      timeLeft,
    };
    localStorage.setItem('quizState', JSON.stringify(state));
  }, [currentQuestion, score, correctAnswers, wrongAnswers, startTime, timeLeft, questions.length]);

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

  if (questions.length === 0) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Progress and Timer */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <div className="h-2 w-32 sm:w-48 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Score Display */}
            <div className="flex items-center space-x-2 bg-purple-50 px-3 sm:px-4 py-2 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium text-purple-600">Score: {score}</span>
            </div>
            {/* Timer */}
            <div className="flex items-center space-x-2 bg-purple-50 px-3 sm:px-4 py-2 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-purple-600">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-4 sm:p-6 bg-white rounded-xl">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">{questions[currentQuestion]?.question}</h2>
          <div className="space-y-2 sm:space-y-3">
            {questions[currentQuestion]?.allAnswers.map((answer, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerSelect(answer)}
                disabled={selectedAnswer !== null}
                variant="outline"
                className={`cursor-pointer w-full md:p-4 lg:p-6 text-left rounded-lg border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${
                  selectedAnswer === answer
                    ? answer === questions[currentQuestion].correct_answer
                      ? 'bg-green-50 border-green-500 text-green-700 shadow-sm'
                      : 'bg-red-50 border-red-500 text-red-700 shadow-sm'
                    : selectedAnswer !== null && answer === questions[currentQuestion].correct_answer
                    ? 'bg-green-50 border-green-500 text-green-700 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-purple-500 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center w-full">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 font-medium mr-4">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-700 text-base">{answer}</span>
                </div>
              </Button>
            ))}
          </div>

          {/* Skip Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSkip}
              variant="outline"
              disabled={selectedAnswer !== null}
              className="cursor-pointer text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300"
            >
              <div className="flex items-center space-x-2">
                <span>Skip</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
} 