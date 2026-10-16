import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminDevice extends Document {
  deviceId: string;
  adminName: string;
  deviceType: string;
  os: string;
  browser: string;
  ip: string;
  rawUserAgent: string;
  registeredAt: Date;
  lastActiveAt: Date;
}

const AdminDeviceSchema = new Schema<IAdminDevice>(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    adminName: {
      type: String,
      required: true,
      trim: true,
    },
    deviceType: {
      type: String,
      default: 'Desktop',
    },
    os: {
      type: String,
      default: 'Unknown',
    },
    browser: {
      type: String,
      default: 'Unknown',
    },
    ip: {
      type: String,
      default: 'Unknown',
    },
    rawUserAgent: {
      type: String,
      default: '',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.AdminDevice) {
  delete mongoose.models.AdminDevice;
}

export default mongoose.model<IAdminDevice>('AdminDevice', AdminDeviceSchema);
