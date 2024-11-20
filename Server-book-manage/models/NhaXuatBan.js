const mongoose = require("mongoose");

const NhaXuatBanSchema = new mongoose.Schema({
  manxb: {
    type: String,
    require: true,
    unquire: true,
  },
  tennxb: {
    type: String,
    require: true,
  },
  diachi: {
    type: String,
    require: true,
  },
});

module.exports = NhaXuatBan = mongoose.model("nhaxuatban", NhaXuatBanSchema);
