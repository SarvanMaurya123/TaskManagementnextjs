// mailer.js
export const sendTaskReminderEmail = (username: string, taskTitle: string, deadline: string): string => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Task Reminder: ${taskTitle}</title>
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
                
                <!-- Greeting and Reminder Message -->
                <h1>Reminder: Task "${taskTitle}" is Approaching Its Deadline!</h1>
                <p>
                    Hello ${username},
                </p>
                <p>
                    This is a friendly reminder that the task <strong>"${taskTitle}"</strong> is due on <strong>${new Date(deadline).toLocaleString()}</strong>.
                </p>
                <p>
                    Please ensure you complete it on time to keep the project on track.
                </p>

                <!-- Footer -->
                <div class="footer">
                    <p>Best Regards,</p>
                    <p>The &lt;SM/&gt; Task Management Team</p>
                </div>
            </div>
        </body>
        </html>
    `;
};
