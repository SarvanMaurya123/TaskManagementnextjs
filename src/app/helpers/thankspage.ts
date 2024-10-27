export const sendRegisterThanksPage = (username: string, email: string): string => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to <SM/> Task Management</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    color: #333;
                    background-color: #f8f9fb;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                    text-align: center;
                }
                .logo {
                    font-size: 32px;
                    font-weight: bold;
                    color: #4a90e2;
                    margin-bottom: 10px;
                }
                h1 {
                    color: #333;
                }
                p {
                    color: #555;
                    line-height: 1.6;
                }
                .button {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 12px 24px;
                    font-size: 16px;
                    color: #ffffff;
                    background-color: #4a90e2;
                    border-radius: 5px;
                    text-decoration: none;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 12px;
                    color: #999;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <!-- Logo Section -->
                <div class="logo">
                    &lt;SM/&gt; Task Management
                </div>
                
                <!-- Greeting and Thank You Message -->
                <h1>Welcome, ${username}!</h1>
                <p>
                    Thank you for joining the <strong>&lt;SM/&gt; Task Management</strong> platform! We're excited to have you onboard.
                    Manage tasks, stay organized, and boost productivity with a platform designed to make your workflow smoother.
                </p>
                <p>
                    Dive in, explore your dashboard, and get started on achieving your goals with ease. If you need any support, 
                    we're just a message away!
                </p>

                <!-- Button to Platform -->
                <a href="#" class="button">Go to Dashboard</a>

                <!-- Footer -->
                <div class="footer">
                    <p>Best Regards,</p>
                    <p>The &lt;SM/&gt; Team</p>
                </div>
            </div>
        </body>
        </html>
    `;
};
