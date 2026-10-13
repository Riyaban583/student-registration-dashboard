'use server';

import { connectToDatabase } from '@/lib/db';
import Setting from '@/models/Setting';
import { revalidatePath } from 'next/cache';

const REGISTRATION_KEY = 'student_registration';
const DEFAULT_CLOSED_MESSAGE =
  'Student registrations are currently closed by the Placement Cell. Please check back later or contact the administration.';

export async function getRegistrationStatus() {
  try {
    await connectToDatabase();
    const setting = (await Setting.findOne({ key: REGISTRATION_KEY }).lean()) as any;

    if (!setting || !setting.value) {
      return {
        success: true,
        isOpen: true,
        closedMessage: DEFAULT_CLOSED_MESSAGE,
        updatedAt: null,
      };
    }

    return {
      success: true,
      isOpen: setting.value.isOpen !== false,
      closedMessage: setting.value.closedMessage || DEFAULT_CLOSED_MESSAGE,
      updatedAt: setting.updatedAt ? new Date(setting.updatedAt).toISOString() : null,
    };
  } catch (error: any) {
    console.error('Error fetching registration status:', error);
    return {
      success: false,
      isOpen: true, // Default to open in case of error
      closedMessage: DEFAULT_CLOSED_MESSAGE,
      error: error.message || 'Failed to fetch status',
    };
  }
}

export async function updateRegistrationStatus(isOpen: boolean, closedMessage?: string) {
  try {
    await connectToDatabase();

    const message = closedMessage?.trim() || DEFAULT_CLOSED_MESSAGE;

    const updatedSetting: any = await Setting.findOneAndUpdate(
      { key: REGISTRATION_KEY },
      {
        key: REGISTRATION_KEY,
        value: {
          isOpen,
          closedMessage: message,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    revalidatePath('/student-register');
    revalidatePath('/admin/scanner');
    revalidatePath('/admin/scanner/review');
    revalidatePath('/');

    return {
      success: true,
      isOpen: updatedSetting.value.isOpen !== false,
      closedMessage: updatedSetting.value.closedMessage,
      updatedAt: updatedSetting.updatedAt ? new Date(updatedSetting.updatedAt).toISOString() : null,
    };
  } catch (error: any) {
    console.error('Error updating registration status:', error);
    return {
      success: false,
      error: error.message || 'Failed to update registration status',
    };
  }
}
