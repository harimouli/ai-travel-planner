const dotenv = require("dotenv");

dotenv.config();

const mongoose = require("mongoose");

// implementing connection with exponential backoff(for retries) without using any external library

// we will try to connect to the database, if it fails, we will wait for some time and try again, we will keep trying until we succeed or we reach a maximum number of retries

// bro i also care about the database, i will not keep trying indefinitely, i will try for a maximum of 5 times with an exponential backoff strategy
const connectDB = async (retries = 5) => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 5,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      minPoolSize: 2,
    });

    console.log("database got connected");
    return connection;
  } catch (error) {
    console.log("Database Error:", error.message);

    if (retries > 1) {
      const delay = Math.pow(2, 6 - retries) * 1000;

      console.log("retrying to connect to the database...");

      await new Promise((resolve) => setTimeout(resolve, delay));

      return connectDB(retries - 1); // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    }
    console.error(
      "Failed to connect to the database after multiple attempts. Exiting...",
    );
    process.exit(1); // just come out
  }
};

module.exports = connectDB;
