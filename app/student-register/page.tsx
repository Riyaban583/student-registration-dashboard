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
import {
  GraduationCap,
  ArrowLeft,
  Linkedin,
  Check,
  Users,
  Network,
  Briefcase,
  Camera,
  Palette,
  Code2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { registerStudents } from "@/app/actions/user";

export const DOMAIN_OPTIONS = [
  {
    id: "HR Head",
    name: "HR Head",
    description:
      "Leads internal team operations, student grievance handling, and performance tracking. Coordinates seamless communication between company HRs, faculty, and student coordinators.",
    icon: Users,
  },
  {
    id: "Research & Networking",
    name: "Research & Networking",
    description:
      "Researches prospective companies, analyzes hiring trends, and builds relationships with corporate HRs, industry leaders, and alumni.",
    icon: Network,
  },
  {
    id: "Management",
    name: "Management",
    description:
      "Coordinates placement drives, oversees event logistics, manages schedules, student batches, and ensures smooth recruitment operations.",
    icon: Briefcase,
  },
  {
    id: "Photography & Videography",
    name: "Photography & Videography",
    description:
      "Captures official placement drives, guest lectures, and events; produces video reels, promotional media, and visual archives.",
    icon: Camera,
  },
  {
    id: "Graphic",
    name: "Graphic",
    description:
      "Designs eye-catching posters, banners, social media creatives, brochures, and announcements for placement drives and events.",
    icon: Palette,
  },
  {
    id: "Web dev",
    name: "Web dev",
    description:
      "Develops and maintains placement cell web applications, student dashboards, registration portals, and internal automated tools.",
    icon: Code2,
  },
];

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
  linkedin: z
    .string()
    .min(1, { message: "LinkedIn profile URL is required (or write NONE)" })
    .refine(
      (val) => {
        const trimmed = val.trim().toLowerCase();
        if (
          trimmed === "none" ||
          trimmed === "na" ||
          trimmed === "n/a" ||
          trimmed === "nil" ||
          trimmed === "no"
        ) {
          return true;
        }
        try {
          const url = new URL(val.startsWith("http") ? val : `https://${val}`);
          return url.hostname.includes("linkedin.com");
        } catch {
          return false;
        }
      },
      {
        message:
          "Please enter a valid LinkedIn URL (e.g., https://www.linkedin.com/in/username) or 'NONE'",
      }
    ),
  cgpa: z.string().min(1, { message: "CGPA is required" }),
  back: z.string().min(1, { message: "Back count is required" }),
  summary: z.string().min(1, { message: "This field is required" }),
  clubs: z.string().min(1, { message: "Clubs field is required" }),
  aim: z.string().min(2, { message: "Aim is required" }),
  believe: z.string().min(2, { message: "This field is required" }),
  expect: z.string().min(2, { message: "This field is required" }),
  domain: z
    .array(z.string())
    .min(1, { message: "Select at least one domain" })
    .max(2, { message: "You can select up to 2 domains only" }),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<any>([]);
  const [expandedDomains, setExpandedDomains] = useState<string[]>([]);

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
      eventName: "Core Team Recruitment",
      branch: "",
      year: "",
      phoneNumber: "",
      linkedin: "",
      cgpa: "",
      back: "",
      summary: "",
      clubs: "",
      aim: "",
      believe: "",
      expect: "",
      domain: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const trimmedLinkedin = values.linkedin.trim();
      const isNone =
        trimmedLinkedin.toLowerCase() === "none" ||
        trimmedLinkedin.toLowerCase() === "na" ||
        trimmedLinkedin.toLowerCase() === "n/a" ||
        trimmedLinkedin.toLowerCase() === "nil" ||
        trimmedLinkedin.toLowerCase() === "no";

      const normalizedValues = {
        ...values,
        linkedin: isNone
          ? "NONE"
          : trimmedLinkedin.startsWith("http")
          ? trimmedLinkedin
          : `https://${trimmedLinkedin}`,
      };

      console.log("Form values:", normalizedValues);
      const result = await registerStudents(normalizedValues);

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
        <Card className="w-full max-w-xl md:max-w-2xl shadow-md border-border/80">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">PTP Core Team Recruitment</CardTitle>
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

                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Linkedin className="h-4 w-4 text-[#0077b5]" />
                        LinkedIn Profile URL
                        <span className="text-xs text-muted-foreground font-normal">
                          (or write NONE if you don't have one)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.linkedin.com/in/yourprofile"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <FormField
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
                      <FormLabel>Active in which Clubs? (Write NONE if not active in any )</FormLabel>
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
                  render={({ field }) => {
<<<<<<< HEAD
                    const selectedDomains = field.value || [];
                    const isMaxReached = selectedDomains.length >= 2;

                    const toggleDomain = (domainId: string) => {
                      if (selectedDomains.includes(domainId)) {
                        field.onChange(
                          selectedDomains.filter((d) => d !== domainId)
                        );
                        setExpandedDomains((prev) =>
                          prev.filter((d) => d !== domainId)
                        );
                      } else {
                        if (selectedDomains.length < 2) {
                          field.onChange([...selectedDomains, domainId]);
                          setExpandedDomains((prev) =>
                            prev.includes(domainId) ? prev : [...prev, domainId]
                          );
                        } else {
                          toast({
                            variant: "destructive",
                            title: "Limit reached",
                            description:
                              "You can select up to 2 domains only. Uncheck an option to choose another.",
                          });
                        }
                      }
                    };

                    const toggleExpand = (e: React.MouseEvent, domainId: string) => {
                      e.stopPropagation();
                      setExpandedDomains((prev) =>
                        prev.includes(domainId)
                          ? prev.filter((d) => d !== domainId)
                          : [...prev, domainId]
                      );
                    };

                    return (
                      <FormItem className="space-y-3">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-sm font-medium">
                            Select your preferred domain(s) [MAX:2]
                          </FormLabel>
                          <Badge
                            variant={
                              selectedDomains.length === 2
                                ? "default"
                                : "secondary"
                            }
                            className="font-medium text-xs px-2.5 py-0.5"
                          >
                            {selectedDomains.length}/2 selected
                          </Badge>
                        </div>

                        <div className="space-y-2.5">
                          {DOMAIN_OPTIONS.map((option) => {
                            const isSelected = selectedDomains.includes(
                              option.id
                            );
                            const isExpanded =
                              isSelected || expandedDomains.includes(option.id);
                            const isDisabled = !isSelected && isMaxReached;
                            const Icon = option.icon;

                            return (
                              <div
                                key={option.id}
                                onClick={() => toggleDomain(option.id)}
                                className={`group relative rounded-xl border-2 p-3.5 sm:p-4 cursor-pointer transition-all duration-200 select-none ${
                                  isSelected
                                    ? "border-blue-600 bg-blue-50/90 dark:bg-blue-950/40 dark:border-blue-500 shadow-sm ring-1 ring-blue-500/20"
                                    : isDisabled
                                    ? "border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40 opacity-60 hover:opacity-80"
                                    : "border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="pt-0.5 shrink-0">
                                    <div
                                      className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                                        isSelected
                                          ? "bg-blue-600 border-blue-600 text-white"
                                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                      }`}
                                    >
                                      {isSelected && (
                                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <Icon
                                          className={`h-4 w-4 shrink-0 ${
                                            isSelected
                                              ? "text-blue-700 dark:text-blue-400"
                                              : "text-slate-500 dark:text-slate-400"
                                          }`}
                                        />
                                        <span
                                          className={`text-sm sm:text-base font-semibold truncate ${
                                            isSelected
                                              ? "text-blue-950 dark:text-blue-100"
                                              : "text-slate-900 dark:text-slate-100"
                                          }`}
                                        >
                                          {option.name}
                                        </span>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={(e) => toggleExpand(e, option.id)}
                                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-2 shrink-0"
                                        title={isExpanded ? "Hide details" : "Show details"}
                                      >
                                        {isExpanded ? (
                                          <ChevronUp className="h-4 w-4" />
                                        ) : (
                                          <ChevronDown className="h-4 w-4" />
                                        )}
                                      </button>
                                    </div>

                                    {isExpanded && (
                                      <p
                                        className={`mt-2 text-xs sm:text-sm leading-relaxed transition-all duration-200 ${
                                          isSelected
                                            ? "text-slate-800 dark:text-slate-200 font-normal"
                                            : "text-slate-600 dark:text-slate-400 font-normal"
                                        }`}
                                      >
                                        {option.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
=======
                    const domainDescriptions: Record<string, string> = {
                      "HR Head": "Leads internal team operations, student grievance handling, and performance tracking. Coordinates seamless communication between company HRs, faculty, and student coordinators.",
                      "Research & Networking": "Analyzes hiring trends, industry demands, and market insights to target prospective recruiters. Builds and nurtures strategic relationships with alumni and corporate partners for campus drives.",
                      "Management": "Oversees on-ground drive execution, scheduling, venue logistics, and hospitality for visiting corporate teams. Ensures disciplined crowd handling and smooth operational flow during recruitment processes.",
                      "Photography & Videography": "Documents placement drives, corporate talks, workshops, and student success stories through high-quality visual coverage. Produces event reels, recap videos, and promotional footage for the cell's official media.",
                      "Graphic": "Designs high-impact promotional posters, brochures, placement achievement creatives, and official reports. Ensures consistent visual branding across all official announcements and social media handles.",
                      "Web dev": "Builds, deploys, and maintains the official placement portal and drive registration systems. Manages candidate databases, automates eligibility tracking, and ensures a secure, reliable user experience.",
                    };

                    return (
                      <FormItem>
                        <FormLabel>Select your preferred domain(s)  [MAX:2]</FormLabel>
                        <div className="grid grid-cols-1 gap-3">
                          {Object.keys(domainDescriptions).map((domain) => {
                            const isChecked = field.value?.includes(domain);
                            return (
                              <div
                                key={domain}
                                className={`rounded-lg border p-3 transition-all duration-200 ${
                                  isChecked
                                    ? "border-blue-500 bg-blue-950/40 shadow-md shadow-blue-900/20"
                                    : "border-gray-700 bg-gray-900/50 hover:border-gray-500"
                                }`}
                              >
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    value={domain}
                                    checked={isChecked}
                                    onChange={(e) => {
                                      const currentValues = field.value || [];
                                      if (e.target.checked) {
                                        if (currentValues.length < 2) {
                                          field.onChange([...currentValues, domain]);
                                        }
                                      } else {
                                        field.onChange(currentValues.filter((d) => d !== domain));
                                      }
                                    }}
                                    className="accent-blue-500"
                                  />
                                  <span className={`font-medium ${isChecked ? "text-blue-300" : ""}`}>{domain}</span>
                                </label>
                                {isChecked && (
                                  <p className="mt-2 ml-6 text-sm text-gray-400 leading-relaxed animate-in fade-in duration-300">
                                    {domainDescriptions[domain]}
                                  </p>
                                )}
>>>>>>> origin/main
                              </div>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
