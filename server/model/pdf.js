const mongoose = require("mongoose");

const questionItemSchema = new mongoose.Schema(
  {
    question: String,
    options: [{ type: Object }],
  },
  { _id: false } // 👈 disables _id for each question
);

const questionSetSchema = new mongoose.Schema({
  questions: [questionItemSchema],
});

module.exports = mongoose.model("QuestionSet", questionSetSchema);
