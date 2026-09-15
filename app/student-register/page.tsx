"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getEvents } from "../actions/events";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { registerStudents } from "@/app/actions/user";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  branch: z
    .string()
    .min(2, { message: "Branch must be at least 2 characters" }),
  year: z.string().min(1, { message: "Year is required" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  eventName: z
    .string()
    .min(2, { message: "Event name must be at least 2 characters" }),
  universityRollNo: z.string().min(2, {
    message: "University roll number must be at least 2 characters",
  }),
  rollNumber: z
    .string()
    .min(3, { message: "Roll number must be at least 3 characters" }),

    // new ga
  //     cgpa: z.string().min(1, { message: "CGPA is required" }),
  //     back: z.string().min(1, { message: "Back count is required" }),
  //     summary: z.string().min(1, { message: "This field is required" }),
  //       clubs: z.string().min(1, { message: "Clubs field is required" }),

  //        aim: z.string().min(2, { message: "Aim is required" }),
  // believe: z.string().min(2, { message: "This field is required" }),
  // expect: z.string().min(2, { message: "This field is required" }),
  // // domain: z.array(z.string()).min(1, { message: "Select at least one domain" }),
  // domain: z
  // .array(z.string())
  // .min(1, { message: "Select at least one domain" })
  // .max(2, { message: "You can select up to 2 domains only" }),

     // new end 
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<any>([]);

  useEffect(() => {
    const getEventData = async () => {
      const res = await getEvents();
      if (res) {
        setEvents(res);
      }
    };
    getEventData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      rollNumber: "",
      universityRollNo: "",
      eventName: "",
      branch: "",
      year: "",
      phoneNumber: "",
      
      //new gagan
    //    cgpa: "",           
    // back: "",           
    // summary: "", 
    //  clubs: "",

    //  aim: "",
    // believe: "",
    // expect: "",
    // domain: [],
    //new  end
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      console.log("Form values:", values); // Debugging line
      const result = await registerStudents(values);

      if (result.success) {
        toast({
          title: "Registration successful",
          description: "Your have Successfully Registered.",
        });
        router.push(`/student-dashboard?userId=${result.userId}`);
      } else {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description:
            result.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
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
          <img src="/RTU logo.png" alt="Logo" className="h-8 w-8" />
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
            <CardTitle className="text-xl md:text-2xl">ARTICULATE</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Register Yourself to get your QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Student Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="student@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                        >
                          <option value="">Select Branch</option>
                          <option value="CSE">CSE</option>
                          <option value="ECE">ECE</option>
                          <option value="ME">ME</option>
                          <option value="CE">CE</option>
                          <option value="EE">EE</option>
                          <option value="IT">IT</option>
                          <option value="PCE">PCE</option>
                          <option value="PE">PE</option>
                          <option value="AE">AE</option>
                          <option value="EIC">EIC</option>
                          <option value="CHE">CHE</option>
                          <option value="P&I">P&I</option>
                          <option value="Other">Other</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                        >
                          <option value="">Select Year</option>
                          <option value="1">1st</option>
                          <option value="2">2nd</option>
                          <option value="3">3rd</option>
                          <option value="4">4th</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

               

                <FormField
                  control={form.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name</FormLabel>
                      <FormControl>
                        {events.length > 0 ? (
                          <select
                            {...field}
                            className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            <option value="">Select an event</option>
                            {events.map((event:any) => (
                              <option key={event._id} value={event.eventName}>
                                {event.eventName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <select
                            {...field}
                            className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            <option value="">Select an event</option>

                              {/* <option value="Core Team Recruitment">
                                Core Team Recruitment
                              </option> */}
                              <option value="ARTICULATE">
                                ARTICULATE
                              </option>

                          </select>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="universityRollNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University Roll Number</FormLabel>
                      <FormControl>
                        <Input placeholder="22EUCCS033" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rollNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College Roll Number</FormLabel>
                      <FormControl>
                        <Input placeholder="22/285" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


  {/* <FormField
                  control={form.control}
                  name="cgpa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cgpa </FormLabel>
                      <FormControl>
                        <Input placeholder="9.4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                       <FormField
                  control={form.control}
                  name="back"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. of Active Backlogs </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

               <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why should we have you in PTP ?</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="clubs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel >Active in which Clubs? (Write NONE if not active in any )</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                

                <FormField
  control={form.control}
  name="domain"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Select your preferred domain(s)  [MAX:2]</FormLabel>
      <div className="grid grid-cols-2 gap-2">
        {["Management","Graphic Designer","Video Editing","Photography","Content Writer","HR HEAD","Web Developer(Next.js Preferred)"].map((domain) => (
          <label key={domain} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={domain}
              checked={field.value?.includes(domain)}
              onChange={(e) => {
                const currentValues = field.value || [];
                if (e.target.checked) {
                  // Allow adding only if less than 2 already selected
                  if (currentValues.length < 2) {
                    field.onChange([...currentValues, domain]);
                  }
                } else {
                  // Remove if unchecked
                  field.onChange(currentValues.filter((d) => d !== domain));
                }
              }}
            />
            <span>{domain}</span>
          </label>
        ))}
      </div>
      <FormMessage />
    </FormItem>
  )}
/>

  
               <FormField
                  control={form.control}
                  name="aim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What is your aim ?</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <FormField
                  control={form.control}
                  name="believe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Do you believe joining the PTP will lead to placement opportunity?</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <FormField
                  control={form.control}
                  name="expect"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What do you expect from PTP?</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
 */}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already registered?{" "}
              <Link
                href="/student-dashboard"
                className="text-primary underline underline-offset-4"
              >
                Go to Dashboard
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main> 

                {/* <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-lg md:max-w-xl lg:max-w-2xl text-center">
          <h1 className="text-xl font-bold">Oop's, It's too Late!!</h1>
          <h3 className="text-lg font-semibold">Registration Closed</h3>
        </Card>

                 </main> */}

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground flex-col flex items-center">
          <span>
            © {new Date().getFullYear()} Placement Cell. All rights reserved.
          </span>
          <span className="text-sm">Developed By Placement Team</span>
        </div>
      </footer>
    </div>
  );
}
