const express = require("express");
const connectDB = require("./config/db");
const app = express();
const cors = require("cors");

//Connection check with db
connectDB();
app.use(cors());

//Body parses middkeware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API running"));

// Define Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/nha-xuat-ban", require("./routes/nhaxuatbans"));
app.use("/api/sachs", require("./routes/sachs"));
app.use("/api/theo-doi-muon-sach", require("./routes/theodoimuonsachs"));

const PORT = process.env.PORT || 3000;

// app.use(
//   cors({
//     origin: ["http://localhost:8081/*", "http://192.168.1.15:8081/*", "*"], // Chỉ chấp nhận yêu cầu từ domain này
//     methods: ["GET", "POST", "PATCH", "DELETE"], // Chỉ chấp nhận các phương thức sau
//     allowedHeaders: ["Content-Type", "Authorization", "*"], // Chỉ chấp nhận các header được liệt kê
//   })
// );

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
