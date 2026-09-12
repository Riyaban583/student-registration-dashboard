import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  rollNumber: string;
  branch?: string;
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
    branch: {
      type: String,
      trim: true,
      default: '',
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
    strict: false,
  }
);

if (mongoose.models.User && !mongoose.models.User.schema.paths['branch']) {
  delete mongoose.models.User;
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);