const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  student_id: {
    type: String,
    maxlength: 10,
  },
  name: {
    type: String,
    required: true,
    maxlength: 70,
  },
  email: {
    type: String,
    required: true,
    maxlength: 70,
  },
});

module.exports = mongoose.model("Trainer", trainerSchema);
