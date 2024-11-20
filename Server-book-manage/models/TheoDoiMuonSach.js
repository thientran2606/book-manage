const mongoose = require("mongoose");

const TheoDoiMuonSachSchema = new mongoose.Schema({
  madocgia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'docgia',
  },
  masach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sach',
  },
  ngaymuon: {
    type: Date,
    default: Date.now,
  },
  ngaytra: {
    type: Date,
  },
});

module.exports = TheoDoiMuonSach = mongoose.model("theodoimuonsach", TheoDoiMuonSachSchema);
