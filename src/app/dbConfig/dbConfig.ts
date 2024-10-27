import mongoose from "mongoose";
export async function connect() {
    try {
        mongoose.connect(process.env.MONGODB_URL!);
        const connection = mongoose.connection;
        connection.on('connected', () => {
            console.log("Mongodb connection successfull!");
        })

        connection.on('error', () => {
            console.log("mongodb Connection error");
        })
    } catch (error) {
        console.log("somthing gain worngs!:", error);
    }
}