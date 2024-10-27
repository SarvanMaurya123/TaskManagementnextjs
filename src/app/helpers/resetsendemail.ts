// app/components/sendPasswordResetEmail.tsx
export const sendPasswordResetEmail = (username: string, email: string, resetToken: string): string => {
  const resetURL = `${process.env.DOMAIN}/reset-password?token=${resetToken}`;

  const message = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
            text-align: center;
          }
          p {
            color: #555;
            line-height: 1.6;
            margin: 10px 0;
          }
          a {
            display: inline-block;
            margin: 20px 0;
            padding: 12px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
          }
          a:hover {
            background-color: #0056b3;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
            text-align: center;
          }
          @media (max-width: 600px) {
            .container {
              padding: 20px;
            }
            h1 {
              font-size: 24px;
            }
            a {
              padding: 10px 15px;
              font-size: 16px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Password Reset Request</h1>
          <p>Hello ${username},</p>
          <p>We received a request to reset your password for your account associated with this email: <strong>${email}</strong>.</p>
          <p>You can reset your password by clicking on the button below:</p>
          <a href="${resetURL}">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
          <p>This link will expire in 30 minutes for security reasons.</p>
          <div class="footer">
            Best regards,<br>
            The Support Team
          </div>
        </div>
      </body>
      </html>
    `;

  return message;
};
