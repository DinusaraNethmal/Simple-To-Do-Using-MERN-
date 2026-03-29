const nodemailer = require("nodemailer");

const sendEmail = async (email, code) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"Task Master" <no-reply@taskmaster.com>',
      to: email,
      subject: "Your Verification Code",
      text: `Welcome! Your verification code is: ${code}`,
      html: `<h1>Welcome to Task Master</h1><p>Your 6-digit verification code is: <b>${code}</b></p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", email);
  } catch (error) {
    console.error("❌ Nodemailer Error:", error);
  }
};

module.exports = sendEmail;