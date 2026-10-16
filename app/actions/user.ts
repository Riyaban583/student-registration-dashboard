'use server';

import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import Students from '@/models/Students';
import Setting from '@/models/Setting';
import ReviewLog from '@/models/ReviewLog';
import AdminDevice from '@/models/AdminDevice';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { generateToken } from '@/lib/auth';
import jwt from 'jsonwebtoken';
import { sendMail } from '@/lib/email';
import { registrationTemplate } from '@/mail/studentRegistration';
import { toZonedTime, format } from "date-fns-tz";

function parseUserAgent(ua: string) {
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let deviceType = 'Desktop';

  if (!ua) return { browser, os, deviceType };

  if (/windows phone/i.test(ua)) os = 'Windows Phone';
  else if (/win(dows|98|nt|2000|xp|vista|7|8|10|11)/i.test(ua)) os = 'Windows';
  else if (/ipad/i.test(ua)) os = 'iPadOS';
  else if (/iphone|ipod/i.test(ua)) os = 'iOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/cros/i.test(ua)) os = 'ChromeOS';

  if (/ipad|tablet/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/mobi|iphone|ipod|android/i.test(ua)) {
    deviceType = 'Mobile';
  } else {
    deviceType = 'Desktop';
  }

  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/opr|opera/i.test(ua)) browser = 'Opera';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';
  else if (/msie|trident/i.test(ua)) browser = 'Internet Explorer';

  return { browser, os, deviceType };
}

export async function registerUser(userData: { name: string; email: string; rollNumber: string; branch: string }) {
  try {
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: userData.email },
        { rollNumber: userData.rollNumber }
      ]
    });

    if (existingUser) {
      return {
        success: false,
        error: 'A user with this email or roll number already exists'
      };
    }

    // Generate QR code URL (this will be the URL to verify attendance)
    const userId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const qrCodeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://student-dashboard-sable.vercel.app'}/scan/${userId}`;

    // Create new user
    const newUser = new User({
      ...userData,
      qrCode: qrCodeUrl,
      scanId: userId
    });

    await newUser.save();

    revalidatePath('/dashboard');
    revalidatePath('/admin/scanner');

    return {
      success: true,
      userId: String((newUser as any)._id)
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      error: 'Failed to register user'
    };
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase();
    // const user = await User.findById(userId);
    const user = (await User.findById(userId).lean() || await Students.findById(userId).lean()) as any;

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    return {
      success: true,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        branch: user.branch || '',
        qrCode: user.qrCode,
        attendance: (Array.isArray(user.attendance) ? user.attendance : []).map((a: any) => ({
          date: a.date instanceof Date ? a.date.toISOString() : a.date,
          present: a.present,
        })),
      }
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: 'Failed to fetch user' };
  }
}

export async function getUserByRollNumber(rollNumber: string) {
  try {
    await connectToDatabase();
    const normalizedRollNumber = rollNumber.trim();

    if (!normalizedRollNumber) {
      return { success: false, error: 'Roll number is required' };
    }

    const exactRollPattern = new RegExp(`^${escapeRegex(normalizedRollNumber)}$`, 'i');
    const user = (await User.findOne({ rollNumber: exactRollPattern }).lean()
      || await Students.findOne({ rollNumber: exactRollPattern }).lean()) as any;

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    return {
      success: true,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        branch: user.branch || '',
        qrCode: user.qrCode,
        attendance: (Array.isArray(user.attendance) ? user.attendance : []).map((a: any) => ({
          date: a.date instanceof Date ? a.date.toISOString() : a.date,
          present: a.present,
        })),
      }
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: 'Failed to fetch user' };
  }
}

// export async function markAttendance(userId: string) {
//   try {
//     await connectToDatabase();
//     const token = cookies().get('auth-token')?.value;
//     if (!token) {

//       return { success: false, error: 'Unauthorized access' };
//     }

//     const decodedToken: any = jwt.decode(token);
//     if (decodedToken?.role !== 'admin') {

//       return { success: false, error: 'Unauthorized access' };
//     }


//     const user = await User.findOne({qrCode: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/scan/${userId}`});
//     if (!user) {
//       return { success: false, error: 'User not found' };
//     }

//     // Get today's date (without time)
//     const today = new Date().toISOString();
//     today.setHours(0, 0, 0, 0);

//     // Check if attendance already marked for today
//     const attendanceToday = user.attendance.find((a:any) => {
//       const attendanceDate = new Date(a.date);
//       attendanceDate.setHours(0, 0, 0, 0);
//       return attendanceDate.getTime() === today.getTime();
//     });

//     if (attendanceToday) {
//       return { 
//         success: true, 
//         message: 'Attendance already marked for today',
//         user: {
//           id: String(user._id),
//           name: user.name,
//           rollNumber: user.rollNumber
//         }
//       };
//     }

//     // Mark attendance
//     user.attendance.push({
//       date: new Date().toISOString(),
//       present: true
//     });

//     await user.save();
//     revalidatePath('/admin/scanner');

//     return { 
//       success: true, 
//       message: 'Attendance marked successfully',
//       user: {
//         id: String(user._id),
//         name: user.name,
//         rollNumber: user.rollNumber
//       }
//     };
//   } catch (error) {
//     console.error('Error marking attendance:', error);
//     return { success: false, error: 'Failed to mark attendance' };
//   }
// }


const indiaTimeZone = "Asia/Kolkata"; // IST

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function markAttendance(userId: string) {
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

    // Security Fix: Use exact match on scanId to avoid regex injection
    let user = await User.findOne({ scanId: userId });

    if (!user) {
      user = await Students.findOne({ scanId: userId });
    }

    // Fallback for old records without scanId (using escaped regex)
    if (!user) {
      const escapedId = escapeRegex(userId);
      user = await User.findOne({
        qrCode: { $regex: new RegExp(`/scan/${escapedId}$`, 'i') }
      });
      if (!user) {
        user = await Students.findOne({
          qrCode: { $regex: new RegExp(`/scan/${escapedId}$`, 'i') }
        });
      }
    }

    if (!user) {
      return { success: false, error: 'User not found' };

    }

    // ✅ Convert today's date to IST (without time)
    const todayIST = format(toZonedTime(new Date(), indiaTimeZone), 'yyyy-MM-dd');

    // ✅ Check if attendance is already marked for today
    const attendanceToday = user.attendance.find((a: any) => {
      const attendanceDateIST = format(
        toZonedTime(new Date(a.date), indiaTimeZone),
        'yyyy-MM-dd'
      );

      return attendanceDateIST === todayIST; // Compare only the date part
    });

    if (attendanceToday) {
      return {
        success: true,
        message: 'Attendance already marked for today',
        user: {
          id: String(user._id),
          name: user.name,
          rollNumber: user.rollNumber
        }
      };
    }

    // ✅ Store attendance date in UTC (safe for database)
    user.attendance.push({
      date: new Date().toISOString(),
      present: true
    });

    await user.save();
    revalidatePath('/admin/scanner');

    return {
      success: true,
      message: 'Attendance marked successfully',
      user: {
        id: String(user._id),
        name: user.name,
        rollNumber: user.rollNumber
      }
    };
  } catch (error) {
    console.error('Error marking attendance:', error);
    return { success: false, error: 'Failed to mark attendance' };
  }
}


export async function getAllUsers() {
  try {
    await connectToDatabase();
    const users = await User.find({}).sort({ name: 1 }).lean();

    return {
      success: true,
      users: users.map((user: any) => ({
        id: String(user._id),
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        branch: user.branch || '',
        attendance: (Array.isArray(user.attendance) ? user.attendance : []).map((a: any) => ({
          date: a.date instanceof Date ? a.date.toISOString() : a.date,
          present: a.present,
        })),
      }))
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, error: 'Failed to fetch users' };
  }
}

export async function adminLogin(username: string, password: string) {
  try {
    // Fixed admin credentials (in a real app, these would be in env variables)
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin@rtu';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rtu@superadmin@2025';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate JWT token
      const token = generateToken({
        id: 'admin',
        username,
        role: 'admin'
      });

      // Set cookie
      cookies().set({
        name: 'auth-token',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return { success: true };
    }

    return { success: false, error: 'Invalid credentials' };
  } catch (error) {
    console.error('Error during admin login:', error);
    return { success: false, error: 'Login failed' };
  }
}

export async function logout() {
  cookies().delete('auth-token');
  return { success: true };
}



export async function registerStudents(studentData: {
  name: string, email: string, rollNumber: string, universityRollNo: string, eventName: string, branch: string, year: string, phoneNumber: string,
  //new ga
  cgpa: string,
  back: string,
  summary: string,
  clubs: string,
  linkedin: string,
  aim: string,
  believe: string,
  expect: string,
  domain: string[],
  //new  end 
}) {
  try {
    await connectToDatabase();

    // Check if student registration is open
    const statusSetting = (await Setting.findOne({ key: 'student_registration' }).lean()) as any;
    if (statusSetting && statusSetting.value && statusSetting.value.isOpen === false) {
      return {
        success: false,
        error: statusSetting.value.closedMessage || 'Registration is currently closed by the Placement Cell.'
      };
    }

    // Check if user already exists
    const existingUser = await Students.findOne({
      $or: [
        { email: studentData.email },
        { rollNumber: studentData.rollNumber },
        { universityRollNo: studentData.universityRollNo }
      ]
    });

    if (existingUser) {
      return {
        success: false,
        error: 'A user with this email or roll number already exists'
      };
    }

    // Generate QR code URL (this will be the URL to verify attendance)
    const userId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const qrCodeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://student-dashboard-sable.vercel.app'}/scan/${userId}`;

    // Create new user
    const newUser = new Students({
      ...studentData,
      qrCode: qrCodeUrl,
      scanId: userId
    });

    await newUser.save();

    const html = registrationTemplate(newUser.name, studentData.rollNumber, studentData.eventName, qrCodeUrl, studentData.email);
    const mailResponse = await sendMail({
      to: studentData.email,
      subject: 'Registration Confirmation',
      html
    });

    revalidatePath('/dashboard');

    return {
      success: true,
      userId: String((newUser as any)._id)
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      error: 'Failed to register user'
    };
  }
}





export async function getStudentByEmail(email: string) {
  try {
    await connectToDatabase();
    const user = await Students.findOne({ email }).lean() as any;

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    return {
      success: true,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        branch: user.branch,
        universityRollNo: user.universityRollNo,
        eventName: user.eventName,
        phoneNumber: user.phoneNumber,
        year: user.year,
        rollNumber: user.rollNumber,
        qrCode: user.qrCode,
        attendance: (Array.isArray(user.attendance) ? user.attendance : []).map((a: any) => ({
          date: a.date instanceof Date ? a.date.toISOString() : a.date,
          present: a.present,
        })),
      }
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: 'Failed to fetch user' };
  }
}




export async function getStudentById(userId: string) {
  try {
    await connectToDatabase();
    // const user = await User.findById(userId);
    const user = await Students.findById(userId).lean() as any;

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    return {
      success: true,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        branch: user.branch,
        universityRollNo: user.universityRollNo,
        year: user.year,
        eventName: user.eventName,
        phoneNumber: user.phoneNumber,
        qrCode: user.qrCode,
        attendance: (Array.isArray(user.attendance) ? user.attendance : []).map((a: any) => ({
          date: a.date instanceof Date ? a.date.toISOString() : a.date,
          present: a.present,
        })),
      }
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: 'Failed to fetch user' };
  }
}

// aditya changes
export const getAllRecruitments = async () => {
  try {
    await connectToDatabase();
    const students = await Students.find({}).sort({ createdAt: -1 }).lean();

    return {
      success: true,
      students: students.map((user: any) => ({
        id: String(user._id),
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        branch: user.branch,
        universityRollNo: user.universityRollNo,
        year: user.year,
        eventName: user.eventName,
        phoneNumber: user.phoneNumber,
        qrCode: user.qrCode,
        attendance: (Array.isArray(user.attendance) ? user.attendance : []).map((a: any) => ({
          date: a.date instanceof Date ? a.date.toISOString() : a.date,
          present: a.present,
        })),
        cgpa: user.cgpa || "",
        back: user.back || "",
        summary: user.summary || "",
        clubs: user.clubs || "",
        linkedin: user.linkedin || "",
        aim: user.aim || "",
        believe: user.believe || "",
        expect: user.expect || "",
        domain: user.domain || [],
        review: user.review ?? null,
        reviewDomain1: user.reviewDomain1 ?? null,
        reviewDomain2: user.reviewDomain2 ?? null,
        comment: user.comment ?? "",
        roundOneAttendance: user.roundOneAttendance,
        roundTwoAttendance: user.roundTwoAttendance,
        roundOneQualified: user.roundOneQualified,
        roundTwoQualified: user.roundTwoQualified,
      }))
    };
  } catch (error) {
    console.error("Error fetching students:", error);
    return { success: false, error: "Failed to fetch students" };
  }
};

interface ReviewData {
  studentId: string;
  review?: number;
  reviewDomain1?: number | null;
  reviewDomain2?: number | null;
  comment?: string;
  roundOneAttendance?: boolean;
  roundTwoAttendance?: boolean;
  roundOneQualified?: boolean;
  roundTwoQualified?: boolean;
  clientInfo?: {
    deviceId?: string;
    deviceName?: string;
  };
}

export const review = async (data: ReviewData) => {
  try {
    await connectToDatabase();

    const currentStudent = await Students.findById(data.studentId);
    if (!currentStudent) {
      return { success: false, error: "Student not found" };
    }

    const changes: string[] = [];
    const prevDomain1 = currentStudent.reviewDomain1 ?? null;
    const newDomain1 = data.reviewDomain1 ?? null;
    if (prevDomain1 !== newDomain1) {
      changes.push(`Domain 1: ${prevDomain1 !== null ? prevDomain1 : 'None'} → ${newDomain1 !== null ? newDomain1 : 'None'}`);
    }

    const prevDomain2 = currentStudent.reviewDomain2 ?? null;
    const newDomain2 = data.reviewDomain2 ?? null;
    if (prevDomain2 !== newDomain2) {
      changes.push(`Domain 2: ${prevDomain2 !== null ? prevDomain2 : 'None'} → ${newDomain2 !== null ? newDomain2 : 'None'}`);
    }

    const prevComment = (currentStudent.comment || "").trim();
    const newComment = (data.comment || "").trim();
    if (prevComment !== newComment) {
      changes.push(`Comment: "${prevComment || '(empty)'}" → "${newComment || '(empty)'}"`);
    }

    const prevR1Att = !!currentStudent.roundOneAttendance;
    const newR1Att = !!data.roundOneAttendance;
    if (prevR1Att !== newR1Att) {
      changes.push(`Round 1 Attendance: ${prevR1Att ? 'Present' : 'Absent'} → ${newR1Att ? 'Present' : 'Absent'}`);
    }

    const prevR2Att = !!currentStudent.roundTwoAttendance;
    const newR2Att = !!data.roundTwoAttendance;
    if (prevR2Att !== newR2Att) {
      changes.push(`Round 2 Attendance: ${prevR2Att ? 'Present' : 'Absent'} → ${newR2Att ? 'Present' : 'Absent'}`);
    }

    const prevR1Qual = !!currentStudent.roundOneQualified;
    const newR1Qual = !!data.roundOneQualified;
    if (prevR1Qual !== newR1Qual) {
      changes.push(`Round 1 Qualified: ${prevR1Qual ? 'Yes' : 'No'} → ${newR1Qual ? 'Yes' : 'No'}`);
    }

    const prevR2Qual = !!currentStudent.roundTwoQualified;
    const newR2Qual = !!data.roundTwoQualified;
    if (prevR2Qual !== newR2Qual) {
      changes.push(`Round 2 Qualified: ${prevR2Qual ? 'Yes' : 'No'} → ${newR2Qual ? 'Yes' : 'No'}`);
    }

    let ip = 'Unknown IP';
    let rawUserAgent = '';
    try {
      const headerList = headers();
      const forwarded = headerList.get('x-forwarded-for');
      const realIp = headerList.get('x-real-ip');
      ip = forwarded ? forwarded.split(',')[0].trim() : (realIp || 'Unknown IP');
      rawUserAgent = headerList.get('user-agent') || '';
    } catch (e) {
      console.warn("Could not read headers in review action:", e);
    }

    const { browser, os, deviceType } = parseUserAgent(rawUserAgent);
    const friendlyDeviceName = data.clientInfo?.deviceName || `${os} ${deviceType} (${browser})`;

    // Append-only immutable log: saved only if actual changes occurred
    if (changes.length > 0) {
      await ReviewLog.create({
        studentId: String(currentStudent._id),
        studentName: currentStudent.name,
        studentRollNumber: currentStudent.rollNumber,
        previous: {
          reviewDomain1: prevDomain1,
          reviewDomain2: prevDomain2,
          comment: prevComment,
          roundOneAttendance: prevR1Att,
          roundTwoAttendance: prevR2Att,
          roundOneQualified: prevR1Qual,
          roundTwoQualified: prevR2Qual,
        },
        updated: {
          reviewDomain1: newDomain1,
          reviewDomain2: newDomain2,
          comment: newComment,
          roundOneAttendance: newR1Att,
          roundTwoAttendance: newR2Att,
          roundOneQualified: newR1Qual,
          roundTwoQualified: newR2Qual,
        },
        changes,
        deviceInfo: {
          deviceName: friendlyDeviceName,
          deviceId: data.clientInfo?.deviceId || '',
          browser,
          os,
          deviceType,
          ip,
          rawUserAgent,
        },
      });
    }

    // Update student document
    currentStudent.review = data.review ?? null;
    currentStudent.reviewDomain1 = newDomain1;
    currentStudent.reviewDomain2 = newDomain2;
    currentStudent.comment = newComment;
    currentStudent.roundOneAttendance = newR1Att;
    currentStudent.roundTwoAttendance = newR2Att;
    currentStudent.roundOneQualified = newR1Qual;
    currentStudent.roundTwoQualified = newR2Qual;
    await currentStudent.save();

    revalidatePath('/admin/scanner/review');
    return { success: true };
  } catch (error) {
    console.error("Error reviewing student:", error);
    return { success: false, error: "Failed to review student" };
  }
};

// Tamper-proof, read-only audit log fetchers (NO delete or update actions exist)
export const getStudentReviewLogs = async (studentId: string) => {
  try {
    await connectToDatabase();
    const logs = await ReviewLog.find({ studentId })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      logs: logs.map((log: any) => ({
        id: String(log._id),
        studentId: log.studentId,
        studentName: log.studentName,
        studentRollNumber: log.studentRollNumber,
        changes: log.changes || [],
        previous: log.previous || {},
        updated: log.updated || {},
        deviceInfo: log.deviceInfo || {},
        createdAt: log.createdAt ? log.createdAt.toISOString() : new Date().toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching review logs:", error);
    return { success: false, error: "Failed to fetch logs" };
  }
};

export const getAllReviewLogs = async (limit: number = 100) => {
  try {
    await connectToDatabase();
    const logs = await ReviewLog.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return {
      success: true,
      logs: logs.map((log: any) => ({
        id: String(log._id),
        studentId: log.studentId,
        studentName: log.studentName,
        studentRollNumber: log.studentRollNumber,
        changes: log.changes || [],
        previous: log.previous || {},
        updated: log.updated || {},
        deviceInfo: log.deviceInfo || {},
        createdAt: log.createdAt ? log.createdAt.toISOString() : new Date().toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching all review logs:", error);
    return { success: false, error: "Failed to fetch all review logs" };
  }
};

export async function registerAdminDevice(data: {
  deviceId: string;
  adminName: string;
}) {
  try {
    await connectToDatabase();
    if (!data.deviceId || !data.adminName || !data.adminName.trim()) {
      return { success: false, error: "Device ID and Admin/Reviewer Name are required" };
    }

    let ip = 'Unknown IP';
    let rawUserAgent = '';
    try {
      const headerList = headers();
      const forwarded = headerList.get('x-forwarded-for');
      const realIp = headerList.get('x-real-ip');
      ip = forwarded ? forwarded.split(',')[0].trim() : (realIp || 'Unknown IP');
      rawUserAgent = headerList.get('user-agent') || '';
    } catch (e) {
      console.warn("Could not read headers in registerAdminDevice:", e);
    }

    const { browser, os, deviceType } = parseUserAgent(rawUserAgent);

    const device = await AdminDevice.findOneAndUpdate(
      { deviceId: data.deviceId },
      {
        $set: {
          adminName: data.adminName.trim(),
          deviceType,
          os,
          browser,
          ip,
          rawUserAgent,
          lastActiveAt: new Date(),
        },
        $setOnInsert: {
          registeredAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    return {
      success: true,
      device: {
        deviceId: device.deviceId,
        adminName: device.adminName,
        deviceType: device.deviceType,
        os: device.os,
        browser: device.browser,
        ip: device.ip,
      },
    };
  } catch (error) {
    console.error("Error registering admin device:", error);
    return { success: false, error: "Failed to register admin device" };
  }
}

export async function getRegisteredAdminDevices() {
  try {
    await connectToDatabase();
    const devices = await AdminDevice.find({}).sort({ lastActiveAt: -1 }).lean();
    return {
      success: true,
      devices: devices.map((d: any) => ({
        id: String(d._id),
        deviceId: d.deviceId,
        adminName: d.adminName,
        deviceType: d.deviceType,
        os: d.os,
        browser: d.browser,
        ip: d.ip,
        registeredAt: d.registeredAt ? d.registeredAt.toISOString() : '',
        lastActiveAt: d.lastActiveAt ? d.lastActiveAt.toISOString() : '',
      })),
    };
  } catch (error) {
    console.error("Error fetching registered devices:", error);
    return { success: false, error: "Failed to fetch devices" };
  }
}

export async function updateUserInfo(
  userId: string,
  updateData: {
    branch?: string;
    name?: string;
    email?: string;
    rollNumber?: string;
  }
) {
  try {
    await connectToDatabase();

    const updateFields: any = {};
    if (updateData.branch !== undefined) updateFields.branch = updateData.branch;
    if (updateData.name) updateFields.name = updateData.name;
    if (updateData.email) updateFields.email = updateData.email;
    if (updateData.rollNumber) updateFields.rollNumber = updateData.rollNumber;

    let user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, strict: false }
    );
    if (user) {
      revalidatePath('/dashboard');
      revalidatePath('/admin/scanner');
      return {
        success: true,
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          rollNumber: user.rollNumber,
          branch: user.branch || '',
          qrCode: user.qrCode,
          attendance: (Array.isArray(user.attendance) ? user.attendance : []).map((a: any) => ({
            date: a.date instanceof Date ? a.date.toISOString() : a.date,
            present: a.present,
          })),
        }
      };
    }

    let student = await Students.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, strict: false }
    );
    if (student) {
      revalidatePath('/dashboard');
      revalidatePath('/student-dashboard');
      revalidatePath('/admin/scanner');
      return {
        success: true,
        user: {
          id: String(student._id),
          name: student.name,
          email: student.email,
          rollNumber: student.rollNumber,
          branch: student.branch || '',
          qrCode: student.qrCode,
          attendance: (Array.isArray(student.attendance) ? student.attendance : []).map((a: any) => ({
            date: a.date instanceof Date ? a.date.toISOString() : a.date,
            present: a.present,
          })),
        }
      };
    }

    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Error updating user info:', error);
    return { success: false, error: 'Failed to update user info' };
  }
}

