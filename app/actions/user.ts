'use server';

import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import Students from '@/models/Students';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { generateToken } from '@/lib/auth';
import { any } from 'zod';
import jwt from 'jsonwebtoken';
import { sendMail } from '@/lib/email';
import { registrationTemplate } from '@/mail/studentRegistration';

export async function registerUser(userData: { name: string; email: string; rollNumber: string }) {
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
      qrCode: qrCodeUrl
    });
    
    await newUser.save();
    
    revalidatePath('/dashboard');
    
    return {
      success: true,
      userId: newUser._id.toString()
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
    const user = await User.findById(userId) || await Students.findById(userId);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        qrCode: user.qrCode,
        attendance: user.attendance,
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
    const user = await User.findOne({ rollNumber });
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        qrCode: user.qrCode,
        attendance: user.attendance,
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

    
//     const user = await User.findOne({qrCode: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/scan/${userId}`});
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
//           id: user._id.toString(),
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
//         id: user._id.toString(),
//         name: user.name,
//         rollNumber: user.rollNumber
//       }
//     };
//   } catch (error) {
//     console.error('Error marking attendance:', error);
//     return { success: false, error: 'Failed to mark attendance' };
//   }
// }


import { toZonedTime, format } from "date-fns-tz";
import { QrCode } from 'lucide-react';
import { yearsToDays } from 'date-fns';

const indiaTimeZone = "Asia/Kolkata"; // IST

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

    let user = await User.findOne({
      qrCode: `${process.env.NEXT_PUBLIC_APP_URL || 'https://student-dashboard-sable.vercel.app'}/scan/${userId}`
    });

    if (!user) {
      user = Students.findOne({
        qrCode: `${process.env.NEXT_PUBLIC_APP_URL || 'https://student-dashboard-sable.vercel.app'}/scan/${userId}`
      });
      
    }

    if(!user){
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
          id: user._id.toString(),
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
        id: user._id.toString(),
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
    const users = await User.find({}).sort({ name: 1 });
    
    return {
      success: true,
      users: users.map(user => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        attendance: user.attendance,
      }))
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, error: 'Failed to fetch users' };
  }
}

export async function getAllStudents() {
  try {
    await connectToDatabase();
    const students = await Students.find({}).sort({ name: 1 });

    return {
      success: true,
      students: students.map((student) => ({
        id: student._id.toString(),
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        universityRollNo: student.universityRollNo,
        branch: student.branch,
        year: student.year,
        eventName: student.eventName,
        phoneNumber: student.phoneNumber,
        attendance: student.attendance,
        createdAt: student.createdAt,
      })),
    };
  } catch (error) {
    console.error('Error fetching students:', error);
    return { success: false, error: 'Failed to fetch students' };
  }
}

export async function getAllRecruitments() {
  try {
    await connectToDatabase();
    const students = await Students.find({}).sort({ name: 1 });

    return {
      success: true,
      students: students.map((student) => ({
        id: student._id.toString(),
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        universityRollNo: student.universityRollNo,
        branch: student.branch,
        year: student.year,
        eventName: student.eventName,
        phoneNumber: student.phoneNumber,
        qrCode: student.qrCode,
        attendance: student.attendance,
        cgpa: student.cgpa,
        back: student.back,
        summary: student.summary,
        clubs: student.clubs,
        aim: student.aim,
        believe: student.believe,
        expect: student.expect,
        domain: student.domain || [],
        review: student.review,
        comment: student.comment,
        roundOneAttendance: student.roundOneAttendance,
        roundTwoAttendance: student.roundTwoAttendance,
        roundOneQualified: student.roundOneQualified,
        roundTwoQualified: student.roundTwoQualified,
        createdAt: student.createdAt,
      })),
    };
  } catch (error) {
    console.error('Error fetching recruitment students:', error);
    return { success: false, error: 'Failed to fetch recruitment students' };
  }
}

export async function review(data: {
  studentId: string;
  review?: number | string | null;
  comment?: string;
  roundOneAttendance?: boolean;
  roundTwoAttendance?: boolean;
  roundOneQualified?: boolean;
  roundTwoQualified?: boolean;
}) {
  try {
    await connectToDatabase();

    const student = await Students.findById(data.studentId);
    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    let parsedReview: number | null = null;
    if (data.review !== undefined && data.review !== null && data.review !== '') {
      const numericReview = Number(data.review);
      if (Number.isNaN(numericReview) || numericReview < 0 || numericReview > 10) {
        return { success: false, error: 'Review must be a number between 0 and 10' };
      }
      parsedReview = numericReview;
    }

    student.review = parsedReview;
    student.comment = data.comment ?? student.comment ?? '';
    student.roundOneAttendance = Boolean(data.roundOneAttendance);
    student.roundTwoAttendance = Boolean(data.roundTwoAttendance);
    student.roundOneQualified = Boolean(data.roundOneQualified);
    student.roundTwoQualified = Boolean(data.roundTwoQualified);

    await student.save();
    revalidatePath('/admin/scanner/review');

    return { success: true };
  } catch (error) {
    console.error('Error reviewing student:', error);
    return { success: false, error: 'Failed to update student review' };
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
  localStorage.removeItem('auth-token')
  return { success: true };
}



export async function registerStudents(studentData:{name:string,email:string,rollNumber:string, universityRollNo:string, eventName:string,branch:string, phoneNumber:string,
  //new gagan
   cgpa: string,  
  back: string,
  summary: string,
   clubs: string,

    aim: string,
  believe: string,
  expect: string,
  domain: string[],
  //new  end 
}) { 
  try { 
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await Students.findOne({
      $or: [
        { email: studentData.email },
        { rollNumber: studentData.rollNumber },
        { universityRollNo: studentData.universityRollNo}
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
      qrCode: qrCodeUrl // Assuming qrCode is a field in the User model 
    });
    
    await newUser.save();

    const html = registrationTemplate(newUser.name,studentData.rollNumber,studentData.eventName,qrCodeUrl, studentData.email);
    const mailResponse = await sendMail({
      to: studentData.email,
      subject: 'Registration Confirmation',
      html
    });
    
    revalidatePath('/dashboard');
    
    return {
      success: true,
      userId: newUser._id.toString()
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
    const user = await Students.findOne({ email });
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        branch: user.branch,
        universityRollNo: user.universityRollNo,
        eventName: user.eventName,
        phoneNumber: user.phoneNumber,
        year: user.year,
        rollNumber: user.rollNumber,
        qrCode: user.qrCode,
        attendance: user.attendance,

        //gagan
        cgpa: user.cgpa,
    back: user.back,
    summary: user.summary,
    clubs: user.clubs,
    aim: user.aim,
    believe: user.believe,
    expect: user.expect,
    domain: user.domain,
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
    const user = await Students.findById(userId);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        branch: user.branch,
        universityRollNo: user.universityRollNo,
        year: user.year,
        eventName: user.eventName,
        phoneNumber: user.phoneNumber,
        qrCode: user.qrCode,
        attendance: user.attendance,
        //gagan
        cgpa: user.cgpa,
    back: user.back,
    summary: user.summary,
    clubs: user.clubs,
    aim: user.aim,
    believe: user.believe,
    expect: user.expect,
    domain: user.domain,
      }
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: 'Failed to fetch user' };
  }
}
