// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { GraduationCap } from 'lucide-react';

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       <header className="border-b">
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center space-x-2">
//             <GraduationCap className="h-6 w-6" />
//             <h1 className="text-xl font-bold">Placement Cell</h1>
//           </div>
//           {/* <nav className="flex space-x-4">
//             <Link href="/login">
//               <Button variant="outline">Admin Login</Button>
//             </Link>
//             <Link href="/register">
//               <Button>Register</Button>
//             </Link>
//           </nav> */}
//         </div>
//       </header>

//       <main className="flex-1 container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           <section className="mb-12 text-center">
//             <h2 className="text-2xl md:text-4xl text-center font-bold mb-4">PTP || RTU-KOTA</h2>
//             <p className="text-muted-foreground text-lg mb-6">
//               Streamline attendance tracking for placement activities with our QR code system
//             </p>
//             <div className="flex flex-col sm:flex-row justify-center gap-4">
//               <Link href="/student-register">
//                 <Button size="lg" className="w-full sm:w-auto">Student Registration</Button>
//               </Link>
//               <Link href="/login">
//                 <Button size="lg" className="w-full sm:w-auto">Admin Access</Button>
//               </Link>
//             </div>
//           </section>

//           <div className="grid md:grid-cols-1 gap-6">
//             {/* <Card>
//               <CardHeader>
//                 <CardTitle>Register</CardTitle>
//                 <CardDescription>Create your student profile</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <p>Register with your details to get your unique QR code for attendance tracking.</p>
//               </CardContent>
//               <CardFooter>
//                 <Link href="/register" className="w-full">
//                   <Button className="w-full">Register</Button>
//                 </Link>
//               </CardFooter>
//             </Card> */}

           

//             <Card>
//               <CardHeader>
//                 <CardTitle>Dashboard</CardTitle>
//                 <CardDescription>Track your presence</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <p>View your attendance records and history for placement activities.</p>
//               </CardContent>
//               <CardFooter>
//                 <Link href="/dashboard" className="w-full">
//                   <Button variant="outline" className="w-full">Dashboard</Button>
//                 </Link>
//               </CardFooter>
//             </Card>
//           </div>
//         </div>
//       </main>

//       <footer className="border-t py-6">
//         <div className="container mx-auto px-4 text-center text-sm text-muted-foreground flex flex-col items-center">
//           <span>© {new Date().getFullYear()} Placement Cell. All rights reserved.</span>
         
//           <a className='text-sm'>Developed By Divyanshu Sharma</a>
//         </div>
//       </footer>
//     </div>
//   );
// }


"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GraduationCap, User, ShieldCheck } from 'lucide-react';

export default function Home() {

  // const router = useRouter();
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {/* <GraduationCap className="h-6 w-6 text-primary" /> */}
            <img src="/RTU logo.png" alt="Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">Placement Cell</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-10">
        <section className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">PLACEMENT CELL RTU</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Streamline attendance tracking for placement activities with our QR code system.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/student-register">
              <Button size="lg" className="w-full sm:w-auto">Student Registration</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">Admin Access</Button>
            </Link>
             <Link href="/quizzes">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">Attempt Quiz</Button>
            </Link>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
         

          {/* Student Dashboard */}
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex items-center space-x-2">
              <User className="text-primary" />
              <div>
                <CardTitle>Student Dashboard</CardTitle>
                <CardDescription>View attendance and activity history</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>Track your placement attendance, view history, and stay informed about upcoming events.</p>
            </CardContent>
            <CardFooter>
              <Link href="/student-dashboard" className="w-full">
                <Button variant="outline" className="w-full">Student Dashboard</Button>
              </Link>
            </CardFooter>
          </Card>

           {/* Core Team Dashboard */}
           <Card className="hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex items-center space-x-2">
              <ShieldCheck className="text-primary" />
              <div>
                <CardTitle>Core Team Dashboard</CardTitle>
                <CardDescription>Admin tools and attendance control</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>Access student records, track placement attendance, and manage events efficiently.</p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard" className="w-full">
                <Button className="w-full">Core Dashboard</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Link href='/send-mail' className='flex justify-center p-2'>
          <Button className='max-w-4xl mx-auto mt-5'>
            Recruiter Invitation
          </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground flex flex-col items-center">
          <span>© {new Date().getFullYear()} Placement Cell. All rights reserved.</span>
          <a className="text-sm">Developed By Placement Team</a>
        </div>
      </footer>
    </div>
  );
}
