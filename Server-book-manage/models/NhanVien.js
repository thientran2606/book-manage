const mongoose = require("mongoose");

const NhanVienSchema = new mongoose.Schema({
  msnv: {
    type: String,
    require: true,
    unquire: true,
  },
  hotennv: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  chucvu: {
    type: String,
    require: true,
  },
  diachi: {
    type: String,
    require: true,
  },
  sodienthoai: {
    type: String,
    require: true,
  },
});

module.exports = NhanVien = mongoose.model("nhanvien", NhanVienSchema);
