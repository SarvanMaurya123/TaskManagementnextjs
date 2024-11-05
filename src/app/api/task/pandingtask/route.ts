import { NextResponse } from "next/server";
import { connect } from "@/app/dbConfig/dbConfig"; // Adjust this path as necessary
import Task from "@/app/models/Task"; // Import your Task model
import sendEmail from "@/app/helpers/sendemail"; // Import your sendEmail function
import { sendTaskReminderEmail } from "@/app/helpers/dedlinetaskreminder"; // Import your email template function
import Users from "@/app/models/userModule";

export async function GET(request: Request) {
    try {
        await connect(); // Connect to the database

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId'); // Get userId from query parameters

        // Check if userId is provided
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Fetch user details to get the email
        const user = await Users.findById(userId);
        if (!user || !user.email) {
            return NextResponse.json({ error: "User not found or email is missing" }, { status: 404 });
        }
        const userEmail = user.email; // Get the user's email

        // Fetch tasks for the specified user using assignedTo field
        const tasks = await Task.find({ assignedTo: userId }); // Query tasks for the user

        // Get current time and set the deadline threshold to 24 hours from now
        const now = new Date();
        const deadlineThreshold = new Date(now);
        deadlineThreshold.setHours(now.getHours() + 24); // 24 hours from now

        // Loop through tasks and send reminder emails for those due within the next 24 hours
        tasks.forEach(async (task) => {
            const taskDeadline = new Date(task.deadline);

            // Check if the task is due within the next 24 hours
            if (taskDeadline <= deadlineThreshold && task.status === 'Pending') {
                // Calculate the time remaining until the deadline in milliseconds
                const timeRemaining = taskDeadline.getTime() - now.getTime();

                // Check for the 8-hour intervals and send emails if it's time
                const remindersSent = [0, 8 * 60 * 60 * 1000, 16 * 60 * 60 * 1000]; // 0, 8 hours, 16 hours in milliseconds

                for (const reminder of remindersSent) {
                    if (timeRemaining <= reminder + 8 * 60 * 60 * 1000 && timeRemaining > reminder) {
                        // Construct the email message using your template function
                        const emailMessage = sendTaskReminderEmail(user.username, task.title, task.deadline.toISOString());

                        // Send the email
                        await sendEmail({
                            email: userEmail, // Recipient email address
                            subject: `Reminder: Upcoming Deadline for ${task.title}`,
                            message: emailMessage,
                        });

                        console.log(`Reminder sent for task: ${task.title} at ${now}`);
                        break; // Break after sending one reminder
                    }
                }
            }
        });

        // Map over tasks and add isCompleted property for the response
        const tasksWithStatus = tasks.map(task => ({
            id: task._id.toString(), // Convert ObjectId to string
            title: task.title,
            deadline: task.deadline,
            status: task.status,
            isCompleted: task.status === 'Pending', // Adjust according to your status logic
        }));

        // Respond with the tasks including isCompleted property
        return NextResponse.json(tasksWithStatus, { status: 200 });
    } catch (error) {
        console.error("Error fetching tasks:", error); // Log error for debugging
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}
