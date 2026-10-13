"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UserPlus,
  Lock,
  Unlock,
  ExternalLink,
  Edit3,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getRegistrationStatus, updateRegistrationStatus } from "@/app/actions/settings";

export default function RegistrationToggleCard() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [closedMessage, setClosedMessage] = useState<string>("");
  const [tempMessage, setTempMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [savingMessage, setSavingMessage] = useState<boolean>(false);

  const fetchStatus = async () => {
    try {
      const res = await getRegistrationStatus();
      if (res) {
        setIsOpen(res.isOpen);
        setClosedMessage(res.closedMessage);
        setTempMessage(res.closedMessage);
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleToggle = async (newCheckedState: boolean) => {
    setUpdating(true);
    try {
      const res = await updateRegistrationStatus(newCheckedState, closedMessage);
      if (res.success) {
        setIsOpen(res.isOpen ?? newCheckedState);
        toast({
          title: newCheckedState ? "Registration Opened" : "Registration Closed",
          description: newCheckedState
            ? "Students can now register through the /student-register route."
            : "The /student-register route is now closed. Students will see the closed notice.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: res.error || "Could not update registration status.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update registration status.",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveMessage = async () => {
    setSavingMessage(true);
    try {
      const res = await updateRegistrationStatus(isOpen, tempMessage);
      if (res.success) {
        setClosedMessage(tempMessage);
        setIsModalOpen(false);
        toast({
          title: "Closure Message Saved",
          description: "The notice shown to students when registration is closed has been updated.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: res.error || "Could not save message.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save message.",
      });
    } finally {
      setSavingMessage(false);
    }
  };

  return (
    <>
      <Card
        className={`mb-8 border transition-all duration-300 ${
          isOpen
            ? "border-emerald-500/30 bg-emerald-950/10 shadow-[0_0_20px_rgba(16,185,129,0.06)]"
            : "border-rose-500/30 bg-rose-950/10 shadow-[0_0_20px_rgba(244,63,94,0.06)]"
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2.5 rounded-xl border ${
                  isOpen
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}
              >
                {isOpen ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Student Registration Route
                  <span className="text-xs font-mono font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    /student-register
                  </span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Control applicant access to the student recruitment & registration form
                </CardDescription>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              {loading ? (
                <Badge variant="outline" className="animate-pulse">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Checking...
                </Badge>
              ) : isOpen ? (
                <Badge className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-medium flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  OPEN / ACCEPTING REGISTRATIONS
                </Badge>
              ) : (
                <Badge className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 px-3 py-1 text-xs font-medium flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
                  CLOSED / DISABLED
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  Registration Portal Status:
                </span>
                <span
                  className={`text-sm font-bold ${
                    isOpen ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isOpen ? "Open (Active)" : "Closed (Inactive)"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isOpen
                  ? "Students can visit /student-register, fill the form, and submit their registration."
                  : "Access is blocked. Students will see a 'Registration Closed' notice and form submission is disabled."}
              </p>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              {/* Toggle switch */}
              <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded-md border">
                <span className="text-xs font-medium text-muted-foreground">
                  {isOpen ? "Open" : "Closed"}
                </span>
                <Switch
                  id="registration-toggle"
                  checked={isOpen}
                  disabled={loading || updating}
                  onCheckedChange={handleToggle}
                  className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-rose-600"
                />
                {updating && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
              </div>

              {/* Edit Message Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTempMessage(closedMessage);
                  setIsModalOpen(true);
                }}
                className="text-xs"
              >
                <Edit3 className="h-3.5 w-3.5 mr-1" />
                Closed Message
              </Button>

              {/* Preview Button */}
              <Link href="/student-register" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="text-xs">
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  Preview
                </Button>
              </Link>
            </div>
          </div>

          {!isOpen && closedMessage && (
            <div className="mt-3 flex items-start gap-2 p-2.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <div>
                <span className="font-semibold">Current notice shown to students: </span>
                <span className="italic">"{closedMessage}"</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal to customize closure message */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              Customize Registration Closed Notice
            </DialogTitle>
            <DialogDescription className="text-xs">
              This message will be prominently displayed to students when they visit{" "}
              <code>/student-register</code> while registrations are closed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <label className="text-xs font-medium text-muted-foreground">
              Closure Message / Notice:
            </label>
            <Textarea
              rows={4}
              value={tempMessage}
              onChange={(e) => setTempMessage(e.target.value)}
              placeholder="e.g. Student registrations for recruitment are currently closed. Please check back later."
              className="resize-none text-sm"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              disabled={savingMessage}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveMessage}
              disabled={savingMessage || !tempMessage.trim()}
            >
              {savingMessage ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Saving...
                </>
              ) : (
                "Save Notice"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
