const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("connected");
  } catch (error) {
    console.log(`error in mongodb ${error}`);
  }
};
module.exports = { connectDB };