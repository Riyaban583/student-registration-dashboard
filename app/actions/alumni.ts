'use server';

import { connectToDatabase } from '@/lib/db';
import Alumni from '@/models/Alumni';

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
