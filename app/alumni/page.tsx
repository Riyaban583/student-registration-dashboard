"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Linkedin, Briefcase, GraduationCap } from "lucide-react";
import { getAlumni } from "@/app/actions/alumni";

export default function AlumniPage() {
  const [alumniItems, setAlumniItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlumni() {
      const result = await getAlumni();
      if (result.success && result.alumni) {
        setAlumniItems(result.alumni);
      }
      setLoading(false);
    }
    fetchAlumni();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/RTU logo.png" alt="Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">Placement Cell Alumni</h1>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Proud Alumni</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the incredible journeys of our graduates who are making an impact in top companies worldwide.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
               <Card key={i} className="animate-pulse flex flex-col h-full">
                  <div className="h-48 bg-muted rounded-t-lg"></div>
               </Card>
            ))}
          </div>
        ) : alumniItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
             No alumni profiles have been continuously added yet. Check back later!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumniItems.map((alumni) => (
              <Card key={alumni.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-primary/5 pb-4">
                  <div className="flex items-center space-x-4">
                    {alumni.imageUrl ? (
                      <img src={alumni.imageUrl} alt={alumni.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary/20" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border-2 border-primary/20">
                        {alumni.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-xl">{alumni.name}</CardTitle>
                      <CardDescription className="flex items-center text-primary font-medium mt-1">
                        <GraduationCap className="w-4 h-4 mr-1" />
                        Batch of {alumni.batch}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Briefcase className="w-5 h-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-semibold">{alumni.designation}</p>
                        <p className="text-muted-foreground">{alumni.company}</p>
                      </div>
                    </div>
                    {alumni.branch && (
                      <div className="flex items-start">
                        <GraduationCap className="w-5 h-5 mr-3 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm"><strong>Branch:</strong> {alumni.branch}</p>
                        </div>
                      </div>
                    )}
                    {alumni.package && (
                      <div className="flex items-start text-green-600 dark:text-green-500 font-medium">
                        <span className="w-5 h-5 mr-3 mt-0.5 border border-green-500 rounded-full inline-flex items-center justify-center text-xs font-bold">$</span>
                        <div>
                          <p className="text-sm">Package: {alumni.package}</p>
                        </div>
                      </div>
                    )}
                    {alumni.phone && (
                      <div className="flex items-start">
                        <span className="w-5 h-5 mr-3 text-muted-foreground mt-0.5 font-bold inline-flex justify-center flex-shrink-0">📞</span>
                        <div>
                          <p className="text-sm">{alumni.phone}</p>
                        </div>
                      </div>
                    )}
                    {alumni.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3 pt-2 border-t">
                        {alumni.description}
                      </p>
                    )}
                  </div>
                </CardContent>
                <div className="p-4 border-t bg-muted/20">
                  <Link href={alumni.linkedin.startsWith("http") ? alumni.linkedin : `https://${alumni.linkedin}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      <Linkedin className="w-4 h-4 mr-2 text-[#0077b5]" />
                      Connect on LinkedIn
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Placement Cell. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
