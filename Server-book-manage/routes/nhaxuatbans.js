const NhaXuatBan = require("../models/NhaXuatBan");
const Sach = require("../models/Sach");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

// @route  GET api/nha-xuat-ban/search
// @desc   Get all nha xuat ban list
// @access Public
router.post("/search", async (req, res) => {
  try {
    const nhaXuatBans = await NhaXuatBan.find({
      tennxb: { $regex: req.body.tennxb, $options: "i" },
    });
    res.status(200).json(nhaXuatBans);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route  GET api/nha-xuat-ban/:nhaXuatBanID
// @desc   Get a nha xuat ban
// @access Public
router.get("/:nhaXuatBanID", async (req, res) => {
  try {
    let nhaXuatBanId = req.params.nhaXuatBanID;
    const nhaXuatBan = await NhaXuatBan.findById(nhaXuatBanId);
    if (!nhaXuatBan) {
      return res
        .status(400)
        .json({ errors: [{ message: "Không thể tìm thấy nhà xuất bản này" }] });
    }
    res.status(200).json(nhaXuatBan);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @router  POST api/nha-xuat-ban/create
// @desc    Create Nhà xuất bản
// @access  Private
router.post(
  "/create",
  auth,
  [
    check("tennxb", "Tên nhà xuất bản phải từ 2 đến 100 ký tự").isLength({
      min: 2,
      max: 100,
    }),
    check("diachi").isLength({ max: 500 }).optional(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { tennxb, diachi } = req.body;

    try {
      let nhaXuatBan = await NhaXuatBan.findOne({ tennxb });

      if (nhaXuatBan) {
        return res
          .status(400)
          .json({ errors: [{ message: "Nhà xuất bản đã tồn tại" }] });
      }

      const isAdmin = req.user.role;

      if (isAdmin != "nhanvien") {
        return res.status(400).json({
          errors: [
            { message: "Chỉ có nhân viên mới được thêm mới nhà xuất bản" },
          ],
        });
      }

      let newNhaXuatBan = new NhaXuatBan({
        manxb: "MANXB" + Date.now(),
        tennxb: tennxb,
        diachi: diachi,
      });
      await newNhaXuatBan.save();

      res.status(200).json({
        newNhaXuatBan,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @router  PATCH api/nha-xuat-ban/update
// @desc    Update Nhà xuất bản
// @access  Private
router.patch(
  "/:nhaXuatBanId",
  auth,
  [
    check("tennxb", "Tên nhà xuất bản phải từ 2 đến 100 ký tự").isLength({
      min: 2,
      max: 100,
    }),
    check("diachi").isLength({ max: 500 }).optional(),
  ],
  async (req, res) => {
    let nhaXuatBanId = req.params.nhaXuatBanId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { tennxb, diachi } = req.body;

    try {
      const isAdmin = req.user.role;

      if (isAdmin != "nhanvien") {
        return res.status(400).json({
          errors: [
            { message: "Chỉ có nhân viên mới được thêm mới nhà xuất bản" },
          ],
        });
      }

      let nhaXuatBanOld = await NhaXuatBan.findById(nhaXuatBanId);

      if (nhaXuatBanOld.tennxb != tennxb) {
        let nhaXuatBan = await NhaXuatBan.findOne({ tennxb: tennxb });

        if (nhaXuatBan) {
          return res
            .status(400)
            .json({ errors: [{ message: "Tên nhà xuất bản đã tồn tại" }] });
        }
      }

      await nhaXuatBanOld.update({ $set: { tennxb: tennxb, diachi: diachi } });

      res.status(200).json({
        nhaXuatBanOld,
      });
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

// @route  DELETE api/nha-xuat-ban/:nhaXuatBanId
// @desc   Delete a nha xuat ban
// @access Private
router.delete("/:nhaXuatBanId", auth, async (req, res) => {
  try {
    let nhaXuatBanId = req.params.nhaXuatBanId;
    const nhaXuatBan = await NhaXuatBan.findById(nhaXuatBanId);

    if (!nhaXuatBan) {
      return res
        .status(400)
        .json({ errors: [{ message: "Không thể tìm thấy nhà xuất bản này" }] });
    }

    const isAdmin = req.user.role;

    if (isAdmin != "nhanvien") {
      return res.status(400).json({
        errors: [
          { message: "Chỉ có nhân viên mới được thêm mới nhà xuất bản" },
        ],
      });
    }

    const sach = await Sach.findOne({ manxb: nhaXuatBanId });
    if (sach) {
      return res.status(400).json({
        errors: [
          {
            message:
              "Đã tồn tại sách có liên kết với Nhà xuất bản không thể xóa",
          },
        ],
      });
    }

    await nhaXuatBan.delete();

    res.status(200).json({ message: "Xoá nhà xuất bản thành công" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
