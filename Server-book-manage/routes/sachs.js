const Sach = require("../models/Sach");
const NhaXuatBan = require("../models/NhaXuatBan");
const TheoDoiMuonSach = require("../models/TheoDoiMuonSach");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

// @route  GET api/sachs/search
// @desc   Get all sach list
// @access Public
router.post("/search", async (req, res) => {
  try {
    const { tensach, tacgia, nxbId } = req.body;

    const tensachValidate = tensach || "";
    const tacgiaValidate = tacgia || "";
    const nxbIdValidate = nxbId || null;

    const query = {
      tensach: { $regex: tensachValidate, $options: "i" },
      tacgia: { $regex: tacgiaValidate, $options: "i" },
    };

    if (nxbIdValidate !== null) {
      query.manxb = nxbIdValidate;
    }

    const sachs = await Sach.find(query).populate("manxb", [
      "id",
      "manxb",
      "tennxb",
      "diachi",
    ]);

    res.status(200).json(sachs);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// @route  GET api/sachs/:sachId
// @desc   Get a sach
// @access Public
router.get("/:sachId", async (req, res) => {
  try {
    let sachId = req.params.sachId;

    const sach = await Sach.findById(sachId).populate("manxb", [
      "id",
      "tennxb",
      "manxb",
      "diachi",
    ]);

    if (!sach) {
      return res.status(400).json({
        errors: [{ message: "Không thể tìm thấy sách này" }],
      });
    }

    res.status(200).json(sach);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// @router  POST api/sachs/create
// @desc    Create sách
// @access  Private
router.post(
  "/create",
  auth,
  [
    check("tensach", "Tên Sách phải từ 2 đến 100 ký tự").isLength({
      min: 2,
      max: 100,
    }),
    check("dongia", "Làm ơn nhập đơn giá").exists(),
    check("soquyen", "Làm ơn nhập số quyển").exists(),
    check("namxuatban", "Làm ơn nhập năm xuất bản").exists(),
    check("manxb", "Làm ơn nhập mã nhà xuất bản").exists(),
    check("tacgia", "Làm ơn nhập tác giả").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { manxb, tensach, dongia, soquyen, namxuatban, tacgia } = req.body;

    try {
      let nhaXuatBan = await NhaXuatBan.findOne({ manxb: manxb });

      console.log(manxb, nhaXuatBan);
      if (!nhaXuatBan) {
        return res
          .status(400)
          .json({ errors: [{ message: "Nhà xuất bản không tồn tại" }] });
      }

      const isAdmin = req.user.role;

      if (isAdmin != "nhanvien") {
        return res.status(400).json({
          errors: [{ message: "Chỉ có nhân viên mới được thêm Sách" }],
        });
      }

      let newSach = new Sach({
        masach: "MASach" + Date.now(),
        tensach: tensach,
        dongia: dongia,
        soquyen: soquyen,
        namxuatban: namxuatban,
        manxb: nhaXuatBan.id,
        tacgia: tacgia,
      });
      await newSach.save();

      res.status(200).json({
        newSach,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @router  PATCH api/sachs/update
// @desc    Update sách
// @access  Private
router.patch(
  "/:sachId",
  auth,
  [
    check("tensach", "Tên Sách phải từ 2 đến 100 ký tự").isLength({
      min: 2,
      max: 100,
    }),
    check("dongia", "Làm ơn nhập đơn giá").exists(),
    check("soquyen", "Làm ơn nhập số quyển").exists(),
    check("namxuatban", "Làm ơn nhập năm xuất bản").exists(),
    check("manxb", "Làm ơn nhập mã nhà xuất bản").exists(),
    check("tacgia", "Làm ơn nhập tác giả").exists(),
  ],
  async (req, res) => {
    let sachId = req.params.sachId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { manxb, tensach, dongia, soquyen, namxuatban, tacgia } = req.body;

    try {
      let nhaXuatBan = await NhaXuatBan.findOne({ manxb: manxb });

      console.log(manxb, nhaXuatBan);
      if (!nhaXuatBan) {
        return res
          .status(400)
          .json({ errors: [{ message: "Nhà xuất bản không tồn tại" }] });
      }

      const isAdmin = req.user.role;

      if (isAdmin != "nhanvien") {
        return res.status(400).json({
          errors: [{ message: "Chỉ có nhân viên mới được cập nhật Sách" }],
        });
      }

      let sachOld = await Sach.findById(sachId);

      await sachOld.update({
        $set: {
          tensach: tensach,
          dongia: dongia,
          soquyen: soquyen,
          namxuatban: namxuatban,
          manxb: nhaXuatBan.id,
          tacgia: tacgia,
        },
      });

      res.status(200).json({
        sachOld,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route  DELETE api/sach/:sachId
// @desc   Delete a sach
// @access Private
router.delete("/:sachId", auth, async (req, res) => {
  try {
    let sachId = req.params.sachId;
    const sach = await Sach.findById(sachId);
    if (!sach) {
      return res
        .status(400)
        .json({ errors: [{ message: "Không thể tìm thấy Sách này" }] });
    }

    const isAdmin = req.user.role;

    if (isAdmin != "nhanvien") {
      return res.status(400).json({
        errors: [{ message: "Chỉ có nhân viên mới được xóa Sách" }],
      });
    }

    const theoDoiMuonSach = await TheoDoiMuonSach.findOne({ masach: sachId });
    if (theoDoiMuonSach) {
      return res.status(400).json({
        errors: [
          {
            message:
              "Đã tồn tại sách được mượn có liên kết với Sách không thể xóa",
          },
        ],
      });
    }

    await sach.delete();

    res.status(200).json({ message: "Xoá Sách thành công" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
