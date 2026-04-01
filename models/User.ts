import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  rollNumber: string;
  qrCode: string;
  scanId: string;
  attendance: {
    date: Date;
    present: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
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
    qrCode: {
      type: String,
      unique: true,
    },
    scanId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    attendance: [
      {
        date: {
          type: Date,
          required: true,
        },
        present: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);