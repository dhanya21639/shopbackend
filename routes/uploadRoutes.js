const express = require("express");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/upload", upload.single("image"), (req, res) => {
 res.json({
  message: "Image uploaded successfully",
  image: req.file.filename
 });
});

module.exports = router;