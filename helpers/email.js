// sendMail.js
const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (options) => {
  try {
    const data = await resend.emails.send({
      from: options.from || 'Acme <onboarding@resend.dev>',
      to: options.email,
      subject: options.subject,
      html: options.html,
    });

    console.log('✅ Email sent:', data);
    return data;
  } catch (error) {
    console.error('❌ Email send failed:', error);
    throw new Error('Email not sent');
  }
};

module.exports = { sendMail };
