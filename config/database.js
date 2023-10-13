const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.LOCAL_DB);
    console.log(`Database Connected ${mongoose.connection.host}`);
  } catch (error) {
    console.log("Database connection error", error);
  }
};

module.exports = connectDb;
