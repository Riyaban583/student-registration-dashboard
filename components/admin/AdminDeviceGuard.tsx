"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerAdminDevice } from "@/app/actions/user";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, Laptop, Smartphone, CheckCircle2, User } from "lucide-react";

export default function AdminDeviceGuard() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [detectedOs, setDetectedOs] = useState("");
  const [detectedBrowser, setDetectedBrowser] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Get or create persistent device ID
    let storedId = localStorage.getItem("portal_admin_device_id");
    if (!storedId) {
      storedId = "DEV-" + Math.random().toString(36).substring(2, 7).toUpperCase() + "-" + Date.now().toString(36).toUpperCase();
      localStorage.setItem("portal_admin_device_id", storedId);
    }
    setDeviceId(storedId);

    // 2. Detect basic client info
    const ua = navigator.userAgent;
    let os = "Desktop OS";
    if (/iphone|ipod/i.test(ua)) os = "iPhone (iOS)";
    else if (/ipad/i.test(ua)) os = "iPad (iPadOS)";
    else if (/android/i.test(ua)) os = "Android";
    else if (/win/i.test(ua)) os = "Windows";
    else if (/mac/i.test(ua)) os = "macOS";
    else if (/linux/i.test(ua)) os = "Linux";
    setDetectedOs(os);

    let browser = "Browser";
    if (/edg/i.test(ua)) browser = "Edge";
    else if (/chrome|crios/i.test(ua)) browser = "Chrome";
    else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua)) browser = "Safari";
    setDetectedBrowser(browser);

    setIsMobile(/mobi|android|iphone|ipad/i.test(ua));

    // 3. Check if name is already set
    const storedName = localStorage.getItem("portal_admin_device_name");
    if (!storedName || !storedName.trim()) {
      // Mandatory: Open modal and do not allow closing until name is entered
      setIsOpen(true);
    } else {
      // Refresh last active timestamp in background
      registerAdminDevice({
        deviceId: storedId,
        adminName: storedName.trim(),
      }).catch(() => {});
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = adminName.trim();
    if (cleanName.length < 2) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter your full name (at least 2 characters) to proceed.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerAdminDevice({
        deviceId,
        adminName: cleanName,
      });

      if (res.success) {
        localStorage.setItem("portal_admin_device_name", cleanName);
        toast({
          title: "Device Registered",
          description: `Welcome, ${cleanName}! Your device has been authenticated and linked for audit tracking.`,
        });
        setIsOpen(false);
        // Notify any open review/scanner pages on this tab
        window.dispatchEvent(new Event("admin_device_registered"));
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: res.error || "Could not register device. Please try again.",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to register device.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="p-6 sm:p-8 bg-slate-950 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 max-w-md w-[92vw]"
      >
        <DialogHeader className="space-y-3 text-center sm:text-left">
          <div className="mx-auto sm:mx-0 w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <DialogTitle className="text-2xl font-bold text-white tracking-tight">
            Device Registration Required
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm leading-relaxed">
            Admin panel security policy requires every device to be linked with a verified reviewer name before granting access.
          </DialogDescription>
        </DialogHeader>

        {/* Device Info Badge */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              {isMobile ? <Smartphone className="h-3.5 w-3.5 text-amber-400" /> : <Laptop className="h-3.5 w-3.5 text-blue-400" />}
              Detected Device:
            </span>
            <span className="font-semibold text-slate-100">
              {detectedOs} • {detectedBrowser}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Device ID:</span>
            <span className="font-mono text-slate-300 text-[11px]">
              {deviceId}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-amber-400" />
              Your Full Name / Reviewer Name <span className="text-red-400">*</span>
            </label>
            <Input
              type="text"
              autoFocus
              placeholder="e.g. Om Gupta / Prof. Sharma"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 h-11 text-base focus-visible:ring-amber-400"
              required
            />
            <p className="text-[11px] text-slate-400">
              All marks edits, evaluations, and attendance actions on this device will be permanently recorded under this name.
            </p>
          </div>

          <Button
            type="submit"
            disabled={submitting || adminName.trim().length < 2}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-11 text-sm rounded-xl shadow-lg shadow-amber-500/20 transition"
          >
            {submitting ? (
              "Registering Device..."
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Register & Enter Admin Panel
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
