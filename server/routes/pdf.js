const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const pdfController = require("../controller/pdf");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const uploadDir = path.join(__dirname, "..", "uploads");


if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({ storage });

router.post("/upload", upload.single("pdf"), pdfController.uploadPDF);

module.exports = router;
