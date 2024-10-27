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
    isVerify: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
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
