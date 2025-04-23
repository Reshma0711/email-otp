const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

exports.dbConnect = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB Connection Successfull");
  } catch (err) {
    console.log("DB Conection Failed!",err.message);
  }
};


