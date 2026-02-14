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
      console.log('API: Credentials match! Generating token...');
      console.log('API: JWT_SECRET exists:', !!process.env.JWT_SECRET);
      console.log('API: JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
      
      const token = generateToken({ 
        id: 'admin',
        username,
        role: 'admin'
      });
      
      console.log('API: Token generated successfully');
      console.log('API: Token length:', token?.length || 0);
      console.log('API: Token preview:', token ? token.substring(0, 30) + '...' : 'NULL/EMPTY');
      console.log('API: NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
      
      // Create response with token in body
      const response = NextResponse.json({ 
        success: true,
        token: token // Return token in response body
      });
      
      // Try to set cookie (may not work on some IP addresses)
      console.log('API: Attempting to set cookie for HTTP');
      
      try {
        response.cookies.set({
          name: 'auth-token',
          value: token,
          httpOnly: false, // Allow JavaScript access as fallback
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });
        console.log('API: Cookie set in response');
      } catch (e) {
        console.log('API: Cookie setting failed:', e);
      }
      
      return response;
    }
    
    console.log('API: Invalid credentials');
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    
  } catch (error) {
    console.error('API: Login error:', error);
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}
