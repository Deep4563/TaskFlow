import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendInviteEmail({
  to,
  inviterName,
  projectName,
  inviteUrl,
}: {
  to: string;
  inviterName: string;
  projectName: string;
  inviteUrl: string;
}) {
  await transporter.sendMail({
    from: `"TaskFlow" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `${inviterName} invited you to ${projectName} on TaskFlow`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">You're invited to TaskFlow</h2>
        <p>
          <strong>${inviterName}</strong> has invited you to join 
          <strong>${projectName}</strong> on TaskFlow.
        </p>
        <a 
          href="${inviteUrl}"
          style="
            display: inline-block;
            background: #4f46e5;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            margin: 16px 0;
          "
        >
          Accept Invitation
        </a>
        <p style="color: #9ca3af; font-size: 12px;">
          This link expires in 7 days.
          If you didn't expect this invitation, you can ignore this email.
        </p>
      </div>
    `,
  });
}