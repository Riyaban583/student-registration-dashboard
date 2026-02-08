import mongoose, { Schema, Document } from 'mongoose';

export interface IAlumni extends Document {
  name: string;
  company: string;
  linkedin: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const AlumniSchema = new Schema<IAlumni>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide a company'],
      trim: true,
    },
    linkedin: {
      type: String,
      required: [true, 'Please provide a LinkedIn URL'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Alumni || mongoose.model<IAlumni>('Alumni', AlumniSchema);
