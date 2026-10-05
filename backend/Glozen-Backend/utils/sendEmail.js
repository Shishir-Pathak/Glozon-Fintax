import nodemailer from "nodemailer";

// =====================================================
// CREATE TRANSPORTER (cPanel SMTP)
// =====================================================

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// =====================================================
// VERIFY CONNECTION ON STARTUP
// =====================================================

transporter.verify((error) => {
  if (error) {
    console.error("========================================");
    console.error("EMAIL TRANSPORTER VERIFICATION FAILED");
    console.error("========================================");
    console.error(error);
  } else {
    console.log("========================================");
    console.log("EMAIL TRANSPORTER IS READY TO SEND");
    console.log("========================================");
  }
});

// =====================================================
// SEND EMAIL FUNCTION (NAMED EXPORT)
// =====================================================

export async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Glozon FinTax Careers" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("========================================");
    console.log("EMAIL SENT SUCCESSFULLY");
    console.log("MESSAGE ID:", info.messageId);
    console.log("========================================");

    return info;
  } catch (error) {
    console.error("========================================");
    console.error("EMAIL SENDING ERROR");
    console.error("========================================");
    console.error(error);
    throw error;
  }
}