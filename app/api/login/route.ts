import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    console.log('API: Login attempt for username:', username);
    
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'ptp@123';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
    
    console.log('API: Expected username:', ADMIN_USERNAME);
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = generateToken({ 
        id: 'admin',
        username,
        role: 'admin'
      });
      
      console.log('API: Token generated:', token.substring(0, 20) + '...');
      console.log('API: NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
      
      // Create response
      const response = NextResponse.json({ success: true });
      
      // Set cookie with proper settings for HTTP
      const isHttps = process.env.NEXT_PUBLIC_APP_URL?.startsWith('https://') ?? false;
      
      console.log('API: Setting cookie with secure:', isHttps);
      
      response.cookies.set({
        name: 'auth-token',
        value: token,
        httpOnly: true,
        secure: isHttps,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      
      console.log('API: Cookie set in response');
      
      return response;
    }
    
    console.log('API: Invalid credentials');
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    
  } catch (error) {
    console.error('API: Login error:', error);
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}
