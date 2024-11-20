const mongoose = require("mongoose");

const DocGiaSchema = new mongoose.Schema({
  madocgia: {
    type: String,
    require: true,
    unquire: true,
  },
  holot: {
    type: String,
    require: true,
  },
  ten: {
    type: String,
    require: true,
  },
  ngaysinh: {
    type: Date,
    require: true,
  },
  phai: {
    type: String,
    require: true,
  },
  diachi: {
    type: String,
    require: true,
  },
  dienthoai: {
    type: String,
    require: true,
  },
});

module.exports = DocGia = mongoose.model("docgia", DocGiaSchema);
