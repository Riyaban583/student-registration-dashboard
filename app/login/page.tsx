"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { GraduationCap, ArrowLeft, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminLogin } from '@/app/actions/user';
import { getTokenFromCookies } from '@/lib/auth';
import { useEffect } from 'react';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export default function LoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    async function fetchToken() {
      const res = await fetch("/api/token");
      const data = await res.json();
      console.log('Token check:', data.token);
      setToken(data.token);
      if(data.token) {
        console.log('Token exists, redirecting...');
        window.location.href = '/admin/scanner';
      }
    }
    fetchToken();
  }, []);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      console.log('Attempting login via API...');
      
      // Use API route instead of server action for better cookie handling
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
        credentials: 'include', // Important for cookies
      });
      
      const result = await response.json();
      console.log('Login result:', result);
      
      if (result.success) {
        toast({
          title: "Login successful",
          description: "Redirecting to dashboard...",
        });
        
        // Wait a moment for cookie to be set
        console.log('Waiting for cookie to be set...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verify cookie was set
        const checkToken = await fetch("/api/token", { credentials: 'include' });
        const tokenData = await checkToken.json();
        console.log('Token after login:', tokenData.token);
        
        if (tokenData.token) {
          console.log('Cookie verified, redirecting to /admin/scanner');
          window.location.href = '/admin/scanner';
        } else {
          console.error('Cookie was not set! Check server logs.');
          toast({
            variant: "destructive",
            title: "Login issue",
            description: "Cookie not set. Check server configuration.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: result.error || "Invalid username or password.",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <h1 className="text-xl font-bold">Placement Cell</h1>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Access the QR scanner and attendance management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="admin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Placement Cell. All rights reserved.
        </div>
      </footer>
    </div>
  );
}