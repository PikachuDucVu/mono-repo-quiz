import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/quiz-app";

export const connectMongoose = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to:", mongoose.connection.name);
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
  }
};
