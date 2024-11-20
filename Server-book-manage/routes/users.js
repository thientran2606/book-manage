const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const config = require("config");
const auth = require("../middleware/auth");

const NhanVien = require("../models/NhanVien");
const DocGia = require("../models/DocGia");

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post("/register", async (req, res) => {
  const { ngaysinh, password, sodienthoai, dienthoai } = req.body;

  let isNhanVien = false;

  // check if it is a Admin signup
  if (req.header("admin-signup-key")) {
    // check adminSignupKey
    if (req.header("admin-signup-key") === config.get("admin-signup-key")) {
      isNhanVien = true; // for admin, role is nhan vien
    }
  }

  if (isNhanVien === true) {
    try {
      let user = await NhanVien.findOne({ sodienthoai });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ message: "User already exists" }] });
      }

      const salt = await bcrypt.genSalt(10);

      let hashedPassword = await bcrypt.hash(password, salt);

      user = new NhanVien({
        msnv: "MSNV" + Date.now(),
        hotennv: req.body.hotennv,
        password: hashedPassword,
        chucvu: req.body.chucvu,
        diachi: req.body.diachi,
        sodienthoai: req.body.sodienthoai,
      });

      await user.save();
      const payload = {
        user: {
          id: user.id,
          role: "nhanvien",
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  } else {
    //độc giả
    try {
      let user = await DocGia.findOne({ dienthoai });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ message: "User already exists" }] });
      }

      user = new DocGia({
        madocgia: "MSDG" + Date.now(),
        holot: req.body.holot,
        ten: req.body.ten,
        ngaysinh: req.body.ngaysinh,
        phai: req.body.phai,
        diachi: req.body.diachi,
        dienthoai: req.body.dienthoai,
      });

      await user.save();
      const payload = {
        user: {
          id: user.id,
          role: "docgia",
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({ token, madocgia });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
});

// @route    POST api/users/login
// @desc     Authenticate user and get token
// @access   Public
router.post(
  "/login",
  [
    check("code", "Làm ơn nhập code").exists(),
    check("password", "Làm ơn nhập mật khẩu").exists(),
  ],
  async (req, res) => {
    // res.header("Access-Control-Allow-Origin", "*");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, password } = req.body;

    try {
      let nhanvien = await NhanVien.findOne({ msnv: code });
      let docgia = await DocGia.findOne({ madocgia: code });

      console.log(nhanvien, docgia);

      if (!nhanvien && !docgia) {
        //Nếu cả nhân viên và độc giả không có trong database
        return res
          .status(400)
          .json({ errors: [{ message: "Invalid credentials" }] });
      }

      if (nhanvien) {
        //Nhân viên jwt
        const passwordMatched = await bcrypt.compare(
          password,
          nhanvien.password
        );

        if (!passwordMatched) {
          return res
            .status(400)
            .json({ errors: [{ message: "Invalid credentials" }] });
        }
        const payload = {
          user: {
            id: nhanvien.id,
            role: "nhanvien",
          },
        };

        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({ token: token, role: "nhanvien" });
          }
        );
      } else {
        //Độc giả jwt
        if (password != docgia.dienthoai) {
          return res
            .status(400)
            .json({ errors: [{ message: "Invalid credentials" }] });
        }

        const payload = {
          user: {
            id: docgia.id,
            role: "docgia",
          },
        };

        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({ token: token, role: "docgia" });
          }
        );
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.post("/search", auth, async (req, res) => {
  try {
    const docGias = await DocGia.find({});

    res.status(200).json(docGias);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
