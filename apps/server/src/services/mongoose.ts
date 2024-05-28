import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/";

export const connectMongoose = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
  }
};
