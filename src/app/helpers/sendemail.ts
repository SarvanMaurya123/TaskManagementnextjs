import nodemailer from 'nodemailer';

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
}
const sendEmail = async ({ email, subject, message }: EmailOptions) => {
    // Create a transporter using Gmail's SMTP server
    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.MAILESEND, // Replace with your email password or app-specific password
        },
    });
    // Set the email options
    const mailOptions = {
        from: process.env.FROM,
        to: email, // Recipient email address
        subject: subject, // Email subject
        html: message, // Email content
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
};

export default sendEmail;
