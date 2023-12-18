const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "../", "tmp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    const filename = `${req.user._id}_${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
