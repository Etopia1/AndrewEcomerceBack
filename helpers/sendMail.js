// const nodemailer = require("nodemailer");
// require("dotenv").config();

// //const asyncHandler = require("express-async-handler");
// const sendMail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     service: process.env.SERVICE,
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.MAIL_ID,
//       pass: process.env.MAIL_PASSWORD,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });

//   // async..await is not allowed in global scope, must use a wrapper
//   async function main() {
//     // send mail with defined transport object
//     const info = await transporter.sendMail({
//       from:"",
//       to: options.email,
//       subject: options.subject,
//       html: options.html,
//     });

//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//   }
//   main().catch(console.error);
// };


// module.exports = { sendMail };



const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (options) => {
  try {
    const data = await resend.emails.send({
      from: options.from || 'Your Store <onboarding@resend.dev>', // ✅ default from
      to: options.email, // recipient
      subject: options.subject,
      html: options.html,
    });

    console.log('Email sent:', data);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email not sent');
  }
};

module.exports = { sendMail };
