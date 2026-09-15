// import nodemailer from 'nodemailer';

// interface MailOptions {
//   to: string;
//   subject: string;
//   html: string;
// }

// export const sendMail = async ({ to, subject, html }: MailOptions) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: process.env.EMAIL_USER, 
//         pass: process.env.EMAIL_PASS, 
//       },
//     });

//     const mailOptions = {
//       from: `"Training & Placement Cell || RTU-KOTA" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     return { success: true, info };
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return { success: false, error };
//   }
// };



import nodemailer from 'nodemailer';

type MailAttachment = {
  filename?: string;
  path?: string;
  content?: string | Buffer; // Allow sending file content directly
  contentType?: string;
};

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: MailAttachment[];
}

export const sendMail = async ({ to, subject, html, attachments = [] }: MailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"Training & Placement Cell || RTU-KOTA" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments, // Added here
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
