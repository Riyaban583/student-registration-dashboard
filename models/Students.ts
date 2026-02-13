import mongoose, { Schema, Document } from 'mongoose';
import { string } from 'zod';

export interface IStudent extends Document {
  name: string;
  email: string;
  rollNumber: string;
  universityRollNo: string;
  eventName: string;
  branch: string;
  year: string;
  phoneNumber: string;

  // cgpa: string;
  // back: string;
  // summary: string;
  // clubs: string;
  // aim: string;
  // believe: string;
  // expect: string;
  // domain: string[];

  qrCode: string;

  attendance: { 
    date: Date;
    present: boolean;
  }[];

  //  New fields for review //aditya
  
    review?:number | null;
    comment:string | ""
  

  //  New fields for rounds
  roundOneAttendance?: boolean;
  roundTwoAttendance?: boolean;
  roundOneQualified?: boolean;
  roundTwoQualified?: boolean;

  createdAt: Date;
  updatedAt: Date;
}


const StudentSchema = new Schema<IStudent>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    rollNumber: { 
      type: String,
      required: [true, 'Please provide a roll number'],
      unique: true,
      trim: true,
    },
    universityRollNo: { 
      type: String,
      required: [true, 'Please provide university roll number'],
      trim: true,
    },
    eventName: {  
      type: String,
      required: [true, 'Please provide event name'],
      trim: true,
    },
    branch: {  
      type: String,
      required: [true, 'Please provide branch'],
      trim: true,
    },
    year: {  
      type: String,
      required: [true, 'Please provide year'],
      trim: true,
    },
    phoneNumber: {  
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },

    //new start gagan
    // cgpa: { type: String, required: true, trim: true },
    // back: { type: String, required: true, trim: true },
    // summary: { type: String, required: true, trim: true },
    // clubs: { type: String, required: true, trim: true },
    // aim: { type: String, required: true, trim: true },
    // believe: { type: String, required: true, trim: true },
    // expect: { type: String, required: true, trim: true },
    // domain: { type: [String], required: true, default: [] },
    //new end

    qrCode: {
      type: String,
      unique: true,
      required: [true, 'QR Code is required'],
    },

    attendance: [
      {
        date: { type: Date, required: true },
        present: { type: Boolean, default: true },
      },
    ],

    //  New fields Aditya
    review: { type: Number, default: null },  // marks only
comment: { type: String, default: "" },
    roundOneAttendance: { type: Boolean, default: false },
    roundTwoAttendance: { type: Boolean, default: false },
    roundOneQualified: { type: Boolean, default: false },
    roundTwoQualified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Students || mongoose.model<IStudent>('Students', StudentSchema);