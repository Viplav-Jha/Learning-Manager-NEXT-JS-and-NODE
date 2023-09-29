// import 'dotenv/config';
require('dotenv').config();
import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        service: process.env.SMTP_SERVICE,
        auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      
      transporter.verify(function (error, success) {
        if (error) {
          console.error('SMTP Configuration Error:', error);
        } else {
          console.log('SMTP Configuration is ready to send emails');
        }
      });

      
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_SERVICE:', process.env.SMTP_SERVICE);
console.log('SMTP_MAIL:', process.env.SMTP_MAIL);
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD);


    const { email, subject, template, data } = options;

    // Get the path to the email template file
    const templatePath = path.join(__dirname, '..', 'mails', 'activation-mail.ejs'); // Added '.ejs' extension

    // Render the email template with EJS
    const html: string = await ejs.renderFile(templatePath, data);

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Re-throw the error for higher-level handling
  }
};

export default sendMail;
