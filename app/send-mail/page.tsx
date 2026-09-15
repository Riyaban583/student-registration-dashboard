// "use client";

// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { sendInvitationAction } from "@/app/actions/invitation";

// export default function SendRegistrationMail() {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);

//   const sendMail = async () => {
//     if (!email.trim()) {
//       toast.error("Please enter an email address");
//       return;
//     }

//     setLoading(true);
//     const res = await sendInvitationAction(email);
//     setLoading(false);

//     if (res.success) {
//       toast.success(res.message);
//       setEmail("");
//     } else {
//       toast.error("Something went wrong");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg my-auto space-y-4">
//       <h2 className="text-xl font-bold">Send Registration Mail</h2>
//       <Input
//         placeholder="Enter email address"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <Button onClick={sendMail} disabled={loading}>
//         {loading ? "Sending..." : "Send Email"}
//       </Button>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendInvitationAction } from "@/app/actions/invitation";
import { Loader2 } from "lucide-react"; // Spinner icon

export default function SendRegistrationMail() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMail = async () => {
    if (!email.trim()) {
      toast.error("Please enter a recruiter email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await sendInvitationAction(email);

      if (res.success) {
        toast.success("✅ Invitation sent successfully!");
        setEmail("");
      } else {
        toast.error("❌ Failed to send invitation. Please try again.");
      }
    } catch (error) {
      toast.error("⚠️ Something went wrong. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">

        
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white space-y-5">
      <h2 className="text-2xl font-bold text-center text-blue-700">
        Send Placement Drive Invitation
      </h2>

      <p className="text-gray-600 text-sm text-center">
        Send official email invitations to recruiters for our college placement
        drive. Please double-check the recruiter’s email before sending.
      </p>

      <Input
        placeholder="Enter recruiter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />

      <Button
        onClick={sendMail}
        disabled={loading}
        className="w-full font-medium flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Sending..." : "Send Email Invitation"}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Invitations will be sent from the college’s official email ID with all
        required registration details.
      </p>
    </div>
    </div>
  );
}
