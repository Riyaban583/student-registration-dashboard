'use server';

import { connectToDatabase } from '@/lib/db';
import DriveQuestion from '@/models/DriveQuestion';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function checkQuestionsAccess(): Promise<boolean> {
  // 1. Check admin token
  const token = cookies().get('auth-token')?.value;
  if (token) {
    try {
      const decoded: any = jwt.decode(token);
      if (decoded && typeof decoded === 'object' && decoded.role === 'admin') {
        return true;
      }
    } catch {}
  }

  // 2. Check alumni access token
  const alumniToken = cookies().get('alumni-access-token')?.value;
  if (alumniToken === 'authenticated') {
    return true;
  }

  return false;
}

export async function verifyAndAuthenticateQuestionsAccess(password: string) {
  const ALUMNI_PASSWORD = process.env.ALUMNI_SECTION_PASSWORD || 'alumni123';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

  const cleanPass = (password || '').trim();
  if (cleanPass === ALUMNI_PASSWORD.trim() || cleanPass === ADMIN_PASSWORD.trim()) {
    cookies().set({
      name: 'alumni-access-token',
      value: 'authenticated',
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return { success: true };
  }

  return {
    success: false,
    error: 'Incorrect Password. Enter Admin Password or Alumni Section Password.',
  };
}

export async function logoutQuestionsAccess() {
  cookies().delete('alumni-access-token');
  return { success: true };
}

export interface DriveQuestionInput {
  company: string;
  branch: string;
  role?: string;
  round?: string;
  question: string;
  answer?: string;
  year?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
}

export async function getDriveQuestions(filters?: {
  branch?: string;
  company?: string;
  round?: string;
  search?: string;
}) {
  try {
    await connectToDatabase();

    const query: any = {};

    if (filters?.branch && filters.branch !== 'All' && filters.branch !== 'All Branches') {
      // Include questions specifically for this branch or targeted for "All Branches"
      query.$or = [
        { branch: filters.branch },
        { branch: 'All Branches' },
        { branch: 'All' },
      ];
    }

    if (filters?.company && filters.company !== 'All') {
      query.company = new RegExp(`^${filters.company.trim()}$`, 'i');
    }

    if (filters?.round && filters.round !== 'All') {
      query.round = filters.round;
    }

    if (filters?.search && filters.search.trim()) {
      const searchRegex = new RegExp(filters.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = query.$or
        ? [{ $and: [query.$or, { $or: [{ question: searchRegex }, { company: searchRegex }, { role: searchRegex }] }] }]
        : [
            { question: searchRegex },
            { company: searchRegex },
            { role: searchRegex },
          ];
    }

    const questions = await DriveQuestion.find(query).sort({ createdAt: -1 }).lean();

    return {
      success: true,
      questions: questions.map((q: any) => ({
        id: q._id.toString(),
        company: q.company,
        branch: q.branch,
        role: q.role || 'General',
        round: q.round || 'Interview',
        question: q.question,
        answer: q.answer || '',
        year: q.year || '',
        difficulty: q.difficulty || 'Medium',
        tags: Array.isArray(q.tags) ? q.tags : [],
        createdAt: q.createdAt instanceof Date ? q.createdAt.toISOString() : q.createdAt,
      })),
    };
  } catch (error) {
    console.error('Error fetching drive questions:', error);
    return { success: false, error: 'Failed to fetch drive questions' };
  }
}

export async function getDriveQuestionFilterOptions() {
  try {
    await connectToDatabase();
    const companies = await DriveQuestion.distinct('company');
    const branches = await DriveQuestion.distinct('branch');
    const rounds = await DriveQuestion.distinct('round');
    const totalQuestions = await DriveQuestion.countDocuments();

    return {
      success: true,
      companies: companies.filter(Boolean).sort(),
      branches: branches.filter(Boolean).sort(),
      rounds: rounds.filter(Boolean).sort(),
      totalQuestions,
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return {
      success: false,
      companies: [],
      branches: [],
      rounds: [],
      totalQuestions: 0,
    };
  }
}

export async function addDriveQuestion(data: DriveQuestionInput) {
  try {
    const hasAccess = await checkQuestionsAccess();
    if (!hasAccess) {
      return { success: false, error: 'Unauthorized: Admin or Alumni password access required' };
    }

    await connectToDatabase();

    if (!data.company || !data.branch || !data.question) {
      return { success: false, error: 'Company, branch, and question text are required' };
    }

    const newQuestion = new DriveQuestion({
      company: data.company.trim(),
      branch: data.branch.trim(),
      role: data.role?.trim() || 'General',
      round: data.round?.trim() || 'Technical Interview',
      question: data.question.trim(),
      answer: data.answer?.trim() || '',
      year: data.year?.trim() || new Date().getFullYear().toString(),
      difficulty: data.difficulty || 'Medium',
      tags: Array.isArray(data.tags) ? data.tags : [],
    });

    await newQuestion.save();

    revalidatePath('/placement-questions');
    revalidatePath('/admin/questions');

    return {
      success: true,
      questionId: newQuestion._id.toString(),
    };
  } catch (error) {
    console.error('Error adding drive question:', error);
    return { success: false, error: 'Failed to submit question' };
  }
}

export async function updateDriveQuestion(id: string, data: Partial<DriveQuestionInput>) {
  try {
    const hasAccess = await checkQuestionsAccess();
    if (!hasAccess) {
      return { success: false, error: 'Unauthorized: Admin or Alumni password access required' };
    }

    await connectToDatabase();

    const updated = await DriveQuestion.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, strict: false }
    );

    if (!updated) {
      return { success: false, error: 'Question not found' };
    }

    revalidatePath('/placement-questions');
    revalidatePath('/admin/questions');

    return { success: true };
  } catch (error) {
    console.error('Error updating drive question:', error);
    return { success: false, error: 'Failed to update question' };
  }
}

export async function deleteDriveQuestion(id: string) {
  try {
    const hasAccess = await checkQuestionsAccess();
    if (!hasAccess) {
      return { success: false, error: 'Unauthorized: Admin or Alumni password access required' };
    }

    await connectToDatabase();

    await DriveQuestion.findByIdAndDelete(id);

    revalidatePath('/placement-questions');
    revalidatePath('/admin/questions');

    return { success: true };
  } catch (error) {
    console.error('Error deleting drive question:', error);
    return { success: false, error: 'Failed to delete question' };
  }
}
