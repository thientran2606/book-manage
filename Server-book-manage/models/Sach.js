const mongoose = require("mongoose");

const SachSchema = new mongoose.Schema({
  masach: {
    type: String,
    required: true,
    unique: true,
  },
  tensach: {
    type: String,
    required: true,
  },
  dongia: {
    type: Number,
    required: true,
  },
  soquyen: {
    type: Number,
    required: true,
  },
  namxuatban: {
    type: String,
    required: true,
  },
  manxb: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "nhaxuatban",
  },
  tacgia: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("sach", SachSchema);
