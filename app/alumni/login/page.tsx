"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { loginAlumni } from "@/app/actions/alumni";

export default function AlumniLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await loginAlumni(password);

    if (result.success) {
      toast({
        title: "Success",
        description: "Login successful",
      });
      router.push("/alumni");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Invalid password",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/RTU logo.png" alt="Logo" className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl">Alumni Portal Access</CardTitle>
          <CardDescription>
            Enter the portal password to view our alumni directory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter Access Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Access Portal"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
