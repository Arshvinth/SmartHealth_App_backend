import mongoose from "mongoose";

const connectDB = async (uri) => {
  try {
    const mongoUri = uri || `${process.env.MONGODB_URL}/SmartHealth`;
    if (mongoose.connection.readyState === 0) { 
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 60000,
      });
      console.log("Database Connected");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

export default connectDB;
