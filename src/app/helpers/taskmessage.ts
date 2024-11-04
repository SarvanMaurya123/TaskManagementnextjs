// app/components/sendTaskAssignmentEmail.tsx
export const sendTaskAssignmentEmail = (
    username: string,
    email: string,
    title: string,
    assignedBy: string // User ID or name of the user who assigned the task
): string => {
    const message = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Task Assigned</title>
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
                .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #888;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Task Assigned</h1>
                <p>Hello ${username},</p>
                <p>You have been assigned a new task titled: <strong>${title}</strong>.</p>
                <p>This task was assigned by: <strong>${assignedBy}</strong>.</p>
                <p>If you have any questions, feel free to reach out!</p>
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
