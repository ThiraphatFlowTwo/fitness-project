const Program = require("../models/Program");

exports.createProgram = async (req, res) => {
  try {
    const trainerId = req.user.id || req.user._id;
    
    const program = await Program.create({
      ...req.body,
      trainer: trainerId
    });

    res.status(201).json({ success: true, data: program });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};