import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePasswords(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export const AUTH_COOKIE_NAME = 'admin_session_token';

export function getTokenFromCookies() {
  const cookieStore = cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

export function getUserFromToken() {
  const token = getTokenFromCookies();
  if (!token) return null;
  
  try {
    return verifyToken(token);
  } catch (error) {
    return null;
  }
}

export async function authenticateAdmin(username: string, password: string) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return { id: 'admin', username: ADMIN_USERNAME, role: 'admin' };
  }
  return null;
}

export function isAdmin() {
  const user = getUserFromToken();
  return user && typeof user !== 'string' && user.role === 'admin';
}