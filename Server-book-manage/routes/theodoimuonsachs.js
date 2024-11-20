const Sach = require("../models/Sach");
const NhaXuatBan = require("../models/NhaXuatBan");
const DocGia = require("../models/DocGia");
const TheoDoiMuonSach = require("../models/TheoDoiMuonSach");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

// @route  POST api/theo-doi-muon-sach/search
// @desc   Get all sach list
// @access Public
router.post("/search", auth, async (req, res) => {
  try {
    const isAdmin = req.user.role;

    if (isAdmin == "nhanvien") {
      const { docgiaId, sachId } = req.body;

      let query = {};

      const docgiaIdValidate = docgiaId || null;
      const sachIdValidate = sachId || null;

      if (docgiaIdValidate !== null) {
        query.madocgia = docgiaId;
      }

      if (sachIdValidate !== null) {
        query.masach = sachId;
      }

      console.log(query);

      const sachs = await TheoDoiMuonSach.find(query)
        .populate("madocgia", [
          "id",
          "madocgia",
          "holot",
          "ten",
          "ngaysinh",
          "phai",
          "diachi",
          "dienthoai",
        ])
        .populate("masach", [
          "id",
          "masach",
          "tensach",
          "dongia",
          "soquyen",
          "namxuatban",
          "tacgia",
          "manxb",
        ]);

      res.status(200).json(sachs);
    } else {
      const { sachId } = req.body;
      const docGia = await DocGia.findById(req.user.id);

      let query = { madocgia: docGia.id };

      const sachIdValidate = sachId || null;

      if (sachIdValidate !== null) {
        query.masach = sachId;
      }

      console.log(query);

      const sachs = await TheoDoiMuonSach.find(query)
        .populate("madocgia", [
          "id",
          "madocgia",
          "holot",
          "ten",
          "ngaysinh",
          "phai",
          "diachi",
          "dienthoai",
        ])
        .populate("masach", [
          "id",
          "masach",
          "tensach",
          "dongia",
          "soquyen",
          "namxuatban",
          "phai",
          "tacgia",
          "manxb",
        ]);

      res.status(200).json(sachs);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// @router  POST api/theo-doi-muon-sach/create
// @desc    Create sách
// @access  Private
router.post(
  "/create",
  auth,
  [check("sachId", "Yêu cầu chọn sách").exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { sachId } = req.body;

    const isAdmin = req.user.role;

    console.log(sachId);

    try {
      const sach = await Sach.findById(sachId);

      console.log(sachId, sach);

      if (!sach) {
        return res
          .status(400)
          .json({ errors: [{ message: "Bản ghi sách này không tồn tại" }] });
      }

      if (isAdmin != "docgia") {
        return res.status(400).json({
          errors: [{ message: "Mời đăng nhập tài khoản độc giả để thuê sách" }],
        });
      }

      const docGia = await DocGia.findById(req.user.id);

      console.log(docGia, docGia.id);

      let theoDoiMuonSach = new TheoDoiMuonSach({
        madocgia: docGia.id,
        masach: sach.id,
      });
      await theoDoiMuonSach.save();

      res.status(200).json({
        theoDoiMuonSach,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @router  PATCH api/theo-doi-muon-sach/udpate
// @desc    Cập nhật mượn sách
// @access  Private
router.patch(
  "/update/:theoDoiMuonSachId",
  auth,
  async (req, res) => {
    let theoDoiMuonSachId = req.params.theoDoiMuonSachId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    try {
      let theoDoiMuonSach = await TheoDoiMuonSach.findById(theoDoiMuonSachId);
      if (!theoDoiMuonSach) {
        return res.status(400).json({
          errors: [{ message: "Bản ghi theo dõi mượn sách này không tồn tại" }],
        });
      }

      await TheoDoiMuonSach.updateOne(
        {_id: theoDoiMuonSachId},
        {
        $set: {
          ngaytra: new Date(),
        },
      });


      let response = await TheoDoiMuonSach.findById(theoDoiMuonSachId); 
      console.log(response);
      res.status(200).json({
        response,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
