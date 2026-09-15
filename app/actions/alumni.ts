'use server';

import { connectToDatabase } from '@/lib/db';
import Alumni from '@/models/Alumni';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export interface AlumniInput {
  name: string;
  company: string;
  linkedin: string;
  email: string;
  phone: string;
}

export async function saveAlumniBulk(records: AlumniInput[]) {
  try {
    if (!records || records.length === 0) {
      return { success: false, error: 'No alumni data provided' };
    }

    await connectToDatabase();

    const operations = records.map((record) => ({
      updateOne: {
        filter: { email: record.email.toLowerCase() },
        update: {
          $set: {
            name: record.name.trim(),
            company: record.company.trim(),
            linkedin: record.linkedin.trim(),
            email: record.email.trim().toLowerCase(),
            phone: record.phone.trim(),
          },
        },
        upsert: true,
      },
    }));

    const result = await Alumni.bulkWrite(operations, { ordered: false });

    revalidatePath('/alumni');

    return {
      success: true,
      inserted: result.upsertedCount || 0,
      updated: result.modifiedCount || 0,
    };
  } catch (error) {
    console.error('Error saving alumni:', error);
    return { success: false, error: 'Failed to save alumni records' };
  }
}

export async function getAllAlumni() {
  try {
    await connectToDatabase();
    const alumni = await Alumni.find({}).sort({ name: 1 });

    return {
      success: true,
      alumni: alumni.map((person: any) => ({
        id: person._id.toString(),
        name: person.name,
        company: person.company,
        linkedin: person.linkedin,
        email: person.email,
        phone: person.phone,
      })),
    };
  } catch (error) {
    console.error('Error fetching alumni:', error);
    return { success: false, error: 'Failed to fetch alumni records' };
  }
}

export async function addAlumni(alumniData: {
  name: string;
  batch: string;
  branch: string;
  company: string;
  designation: string;
  package?: string;
  linkedin: string;
  phone: string;
  description?: string;
  imageUrl?: string;
}) {
  try {
    await connectToDatabase();

    const token = cookies().get('auth-token')?.value;
    if (!token) {
      return { success: false, error: 'Unauthorized access' };
    }

    const decodedToken: any = jwt.decode(token);
    if (decodedToken?.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    const newAlumni = new Alumni(alumniData);
    await newAlumni.save();

    revalidatePath('/admin/alumni');
    revalidatePath('/alumni');

    return {
      success: true,
      alumni: {
        id: newAlumni._id.toString(),
        name: newAlumni.name,
        company: newAlumni.company,
      }
    };
  } catch (error) {
    console.error('Error adding alumni:', error);
    return { success: false, error: 'Failed to add alumni' };
  }
}

export async function updateAlumni(id: string, alumniData: any) {
  try {
    await connectToDatabase();

    const token = cookies().get('auth-token')?.value;
    if (!token) {
      return { success: false, error: 'Unauthorized access' };
    }

    const decodedToken: any = jwt.decode(token);
    if (decodedToken?.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    const updatedAlumni = await Alumni.findByIdAndUpdate(id, alumniData, { new: true });

    if (!updatedAlumni) {
      return { success: false, error: 'Alumni not found' };
    }

    revalidatePath('/admin/alumni');
    revalidatePath('/alumni');

    return { success: true };
  } catch (error) {
    console.error('Error updating alumni:', error);
    return { success: false, error: 'Failed to update alumni' };
  }
}

export async function getAlumni() {
  try {
    await connectToDatabase();
    const alumni = await Alumni.find({}).sort({ createdAt: -1 }).lean();

    return {
      success: true,
      alumni: alumni.map((a: any) => ({
        id: a._id.toString(),
        name: a.name,
        batch: a.batch,
        branch: a.branch,
        company: a.company,
        designation: a.designation,
        package: a.package,
        linkedin: a.linkedin,
        phone: a.phone,
        description: a.description,
        imageUrl: a.imageUrl,
      }))
    };
  } catch (error) {
    console.error('Error fetching alumni:', error);
    return { success: false, error: 'Failed to fetch alumni' };
  }
}

export async function deleteAlumni(id: string) {
  try {
    await connectToDatabase();

    const token = cookies().get('auth-token')?.value;
    if (!token) {
      return { success: false, error: 'Unauthorized access' };
    }

    const decodedToken: any = jwt.decode(token);
    if (decodedToken?.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    await Alumni.findByIdAndDelete(id);

    revalidatePath('/admin/alumni');
    revalidatePath('/alumni');

    return { success: true };
  } catch (error) {
    console.error('Error deleting alumni:', error);
    return { success: false, error: 'Failed to delete alumni' };
  }
}

export async function loginAlumni(password: string) {
  const ALUMNI_SECTION_PASSWORD = process.env.ALUMNI_SECTION_PASSWORD || 'alumni123';

  if (password === ALUMNI_SECTION_PASSWORD) {
    cookies().set({
      name: 'alumni-access-token',
      value: 'authenticated',
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return { success: true };
  }

  return { success: false, error: 'Incorrect Password' };
}
