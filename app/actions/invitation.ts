// "use server";

// import path from "path";
// import { sendMail } from "@/lib/email";
// import { recruiterInvitationTemplate } from "@/mail/InvitationMail";

// export async function sendInvitationAction(email: string) {
//     console.log("Sending invitation to:", email);


//   if (!email || !email.includes("@")) {
//     return { success: false, error: "Valid email is required" };
//   }

//   // Brochure path is always fixed
//   const brochurePath = path.join(process.cwd(), "public", "placement-brochure.pdf");

//   const result = await sendMail({
//     to: email,
//     subject: "Invitation for Campus Placement Drive - RTU Kota 2026 Batch",
//     html: recruiterInvitationTemplate(),
//     attachments: [
//       {
//         filename: "RTU_Placement_Brochure.pdf",
//         path: brochurePath,
//         contentType: "application/pdf",
//       },
//     ],
//   });

//   return result.success
//     ? { success: true, message: "Email sent successfully" }
//     : { success: false, error: result.error || "Failed to send email" };
// }




"use server";

import { sendMail } from "@/lib/email";
import { recruiterInvitationTemplate } from "@/mail/InvitationMail";

export async function sendInvitationAction(email: string) {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Valid email is required" };
  }

  try {
    const brochureUrl =
      "https://drive.google.com/uc?export=download&id=1hobGe47cf7M_lpKxGOQMf0Rn69WDkB64";

    // Fetch file as Buffer
    const response = await fetch(brochureUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch brochure from Google Drive`);
    }
    const brochureBuffer = Buffer.from(await response.arrayBuffer());

    const result = await sendMail({
      to: email,
      subject: "Invitation for Campus Placement Drive - RTU Kota 2026 Batch",
      html: recruiterInvitationTemplate(),
      attachments: [
        {
          filename: "RTU_Placement_Brochure.pdf",
          content: brochureBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    return result.success
      ? { success: true, message: "Email sent successfully" }
      : { success: false, error: result.error || "Failed to send email" };
  } catch (err: any) {
    console.error("Error sending invitation:", err);
    return { success: false, error: err.message };
  }
}
