const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const { SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASS } = require('../importantInfo');

emailOtpStore = {};

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASS,
  },
});

async function loadTemplate(templateName) {
  const templatePath = path.join(__dirname, 'emailTemplates', templateName);
  const template = await fs.readFile(templatePath, 'utf8');
  return template;
}

function replaceTemplateVariables(template, variables) {
  return Object.entries(variables).reduce((html, [key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    return html.replace(regex, value);
  }, template);
}

async function sendOtpEmail(toEmail, otpCode) {
  try {
    const template = await loadTemplate('otpTemplate.html');
    const html = replaceTemplateVariables(template, {
      otpCode,
      year: new Date().getFullYear()
    });

    const mailOptions = {
      from: '"SarthiQ" <noreply@sarthiq.com>',
      to: toEmail,
      subject: 'Verify Your Email - SarthiQ',
      html
    };

    const info = await transporter.sendMail(mailOptions);
    //console.log('OTP Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
}

async function sendWelcomeEmail(toEmail, userName) {
  try {
    const template = await loadTemplate('welcomeTemplate.html');
    const html = replaceTemplateVariables(template, {
      userName,
      year: new Date().getFullYear()
    });

    const mailOptions = {
      from: '"SarthiQ" <noreply@sarthiq.com>',
      to: toEmail,
      subject: 'Welcome to SarthiQ - Your Journey Begins Here!',
      html
    };

    const info = await transporter.sendMail(mailOptions);
    //console.log('Welcome Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

module.exports = {
  sendOtpEmail,
  sendWelcomeEmail,
  emailOtpStore
};
