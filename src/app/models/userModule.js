import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        validate: {
            validator: (v) => /^[a-zA-Z0-9\s]+$/.test(v), // Allows spaces
            message: 'Username must contain only alphanumeric characters and spaces',
        },
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    isActive: {
        type: Boolean,
        default: false, // New users are active by default
    },
    isVerify: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    department: {
        type: String,
        enum: ['Developer', 'Designer', 'Tester', 'Markating', 'Others'],
        default: 'Developer',
    },
    forgetPasswordToken: String,
    forgetPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets the creation date to now
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tasks"
    }],
});

userSchema.methods.createPasswordResetToken = function () {
    // Create a reset token using crypto
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token and set it to forgetPasswordToken field
    this.forgetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set token expiry to 10 minutes from now
    this.forgetPasswordTokenExpiry = Date.now() + 10 * 60 * 1000;

    return resetToken; // Return the plain token to send to the user
};

// Check if the model is already compiled
const Users = mongoose.models.Users || mongoose.model("Users", userSchema);

export default Users;
