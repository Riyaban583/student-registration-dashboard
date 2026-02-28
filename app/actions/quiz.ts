'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import Quiz, { IQuiz, IQuizQuestion } from '@/models/Quiz';
import QuizAttempt, { IQuizAttempt } from '@/models/QuizAttempt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function requireAdmin() {
  const token = cookies().get('auth-token')?.value;
  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || decoded.role !== 'admin') {
      throw new Error('Unauthorized');
    }
  } catch (error) {
    throw new Error('Unauthorized');
  }
}

function normalizeQuestions(rawQuestions: IQuizQuestion[]): IQuizQuestion[] {
  return rawQuestions.map((q) => ({
    prompt: q.prompt.trim(),
    options: q.options.map((opt) => ({ text: opt.text.trim(), isCorrect: !!opt.isCorrect })),
  }));
}

export async function createQuiz(payload: {
  title: string;
  description?: string;
  durationMinutes: number;
  questions: IQuizQuestion[];
  tags?: string[];
  published?: boolean;
}) {
  try {
    requireAdmin();
    await connectToDatabase();

    const quiz = await Quiz.create({
      title: payload.title.trim(),
      description: payload.description?.trim() || '',
      durationMinutes: payload.durationMinutes,
      questions: normalizeQuestions(payload.questions),
      tags: payload.tags || [],
      published: payload.published ?? true,
    });

    revalidatePath('/admin/quiz-management');
    revalidatePath('/quizzes');

    return { success: true, quizId: quiz._id.toString() };
  } catch (error: any) {
    console.error('createQuiz error', error);
    return { success: false, error: error.message || 'Failed to create quiz' };
  }
}

export async function updateQuiz(quizId: string, payload: Partial<IQuiz>) {
  try {
    requireAdmin();
    await connectToDatabase();

    const update: Partial<IQuiz> = {};
    if (payload.title) update.title = payload.title.trim();
    if (typeof payload.description === 'string') update.description = payload.description.trim();
    if (typeof payload.durationMinutes === 'number') update.durationMinutes = payload.durationMinutes;
    if (Array.isArray((payload as any).questions)) {
      (update as any).questions = normalizeQuestions((payload as any).questions);
    }
    if (Array.isArray((payload as any).tags)) update.tags = (payload as any).tags;
    if (typeof payload.published === 'boolean') update.published = payload.published;

    const quiz = await Quiz.findByIdAndUpdate(quizId, update, { new: true });
    if (!quiz) return { success: false, error: 'Quiz not found' };

    revalidatePath('/admin/quiz-management');
    revalidatePath('/quizzes');

    return { success: true, quizId: quiz._id.toString() };
  } catch (error: any) {
    console.error('updateQuiz error', error);
    return { success: false, error: error.message || 'Failed to update quiz' };
  }
}

export async function deleteQuiz(quizId: string) {
  try {
    requireAdmin();
    await connectToDatabase();
    await Quiz.findByIdAndDelete(quizId);
    await QuizAttempt.deleteMany({ quiz: quizId });

    revalidatePath('/admin/quiz-management');
    revalidatePath('/quizzes');

    return { success: true };
  } catch (error: any) {
    console.error('deleteQuiz error', error);
    return { success: false, error: error.message || 'Failed to delete quiz' };
  }
}

export async function listQuizzes(includeUnpublished = false) {
  try {
    await connectToDatabase();
    const filter = includeUnpublished ? {} : { published: true, live: true };
    const quizzes = (await Quiz.find(filter).sort({ createdAt: -1 }).lean()) as any[];

    return {
      success: true,
      quizzes: quizzes.map((quiz: any) => ({
        id: String(quiz._id),
        title: quiz.title,
        description: quiz.description,
        durationMinutes: quiz.durationMinutes,
        questionCount: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
        tags: Array.isArray(quiz.tags) ? quiz.tags : [],
        published: !!quiz.published,
        live: !!quiz.live,
      })),
    };
  } catch (error: any) {
    console.error('listQuizzes error', error);
    return { success: false, error: error.message || 'Failed to list quizzes' };
  }
}

export async function toggleLive(quizId: string) {
  try {
    requireAdmin();
    await connectToDatabase();
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return { success: false, error: 'Quiz not found' };
    
    quiz.live = !quiz.live;
    await quiz.save();
    
    revalidatePath('/admin/quiz-management');
    revalidatePath('/quizzes');
    
    return { success: true, live: quiz.live };
  } catch (error: any) {
    console.error('toggleLive error', error);
    return { success: false, error: error.message || 'Failed to toggle live status' };
  }
}

export async function getQuizById(quizId: string) {
  try {
    await connectToDatabase();
    const quiz = (await Quiz.findById(quizId).lean()) as any;
    if (!quiz) return { success: false, error: 'Quiz not found' };

    return {
      success: true,
      quiz: {
        id: String(quiz._id),
        title: quiz.title,
        description: quiz.description,
        durationMinutes: quiz.durationMinutes,
        questions: (Array.isArray(quiz.questions) ? quiz.questions : []).map((q: any) => ({
          id: q._id?.toString(),
          prompt: q.prompt,
          options: q.options,
        })),
      },
    };
  } catch (error: any) {
    console.error('getQuizById error', error);
    return { success: false, error: error.message || 'Failed to fetch quiz' };
  }
}

export async function submitQuizAttempt(params: {
  quizId: string;
  answers: { questionId: string; selectedIndex: number }[];
  participant?: { name?: string; email?: string; rollNumber?: string };
  startedAt?: string;
}) {
  try {
    await connectToDatabase();
    const quiz = (await Quiz.findById(params.quizId).lean()) as any;
    if (!quiz) return { success: false, error: 'Quiz not found' };

    const startedAt = params.startedAt ? new Date(params.startedAt) : new Date();
    const completedAt = new Date();
    const answers = params.answers.map((ans) => {
      const q = quiz.questions.find((item: any) => item._id?.toString() === ans.questionId);
      const isCorrect = !!q?.options?.[ans.selectedIndex]?.isCorrect;
      return {
        questionId: new Types.ObjectId(ans.questionId),
        selectedIndex: ans.selectedIndex,
        isCorrect,
      };
    });

    const score = answers.filter((a) => a.isCorrect).length;
    const totalQuestions = Array.isArray(quiz.questions) ? quiz.questions.length : 0;

    await QuizAttempt.create({
      quiz: new Types.ObjectId(params.quizId),
      participant: params.participant || {},
      answers,
      score,
      totalQuestions,
      startedAt,
      completedAt,
      durationSeconds: Math.max(1, Math.round((completedAt.getTime() - startedAt.getTime()) / 1000)),
    });

    return {
      success: true,
      score,
      totalQuestions,
      percentage: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0,
    };
  } catch (error: any) {
    console.error('submitQuizAttempt error', error);
    return { success: false, error: error.message || 'Failed to submit attempt' };
  }
}

export async function getQuizAnalytics(quizId: string) {
  try {
    requireAdmin();
    await connectToDatabase();

    const [summary] = await QuizAttempt.aggregate([
      { $match: { quiz: new Types.ObjectId(quizId) } },
      {
        $group: {
          _id: '$quiz',
          attempts: { $sum: 1 },
          avgScore: { $avg: '$score' },
          avgPercent: { $avg: { $multiply: [{ $divide: ['$score', '$totalQuestions'] }, 100] } },
        },
      },
    ]);

    const attempts = (await QuizAttempt.find({ quiz: quizId }).sort({ createdAt: -1 }).limit(25).lean()) as any[];

    return {
      success: true,
      summary: summary
        ? {
            attempts: summary.attempts,
            avgScore: Number(summary.avgScore?.toFixed(2) || 0),
            avgPercent: Number(summary.avgPercent?.toFixed(1) || 0),
          }
        : { attempts: 0, avgScore: 0, avgPercent: 0 },
      attempts: attempts.map((att: any) => ({
        id: String(att._id),
        participant: att.participant || {},
        score: Number(att.score || 0),
        totalQuestions: Number(att.totalQuestions || 0),
        percent: att.totalQuestions ? Math.round((Number(att.score || 0) / Number(att.totalQuestions || 0)) * 100) : 0,
        completedAt: att.completedAt,
      })),
    };
  } catch (error: any) {
    console.error('getQuizAnalytics error', error);
    return { success: false, error: error.message || 'Failed to load analytics' };
  }
}
