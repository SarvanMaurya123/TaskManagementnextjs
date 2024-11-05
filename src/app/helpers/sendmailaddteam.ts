// Function to generate the email template for team addition
export const sendTeamAdditionEmail = (username: string, teamName: string): string => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ${teamName}!</title>
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
                
                <!-- Greeting and Welcome Message -->
                <h1>Welcome to ${teamName}, ${username}!</h1>
                <p>
                    We’re excited to let you know that you’ve been added to the <strong>${teamName}</strong> team! Your team leader has included you to collaborate and achieve great things together.
                </p>
                <p>
                    Log in to your dashboard to see the tasks assigned to your team, contribute to the project, and stay organized as a team.
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
