const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, safeName + path.extname(file.originalname));
  },
});

function fileFilter(req, file, cb) {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG or WEBP images are allowed.'));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
});

// Admin uploads up to 3 images per place: primary, image_1, image_2
const placeImageUpload = upload.fields([
  { name: 'primary_image', maxCount: 1 },
  { name: 'image_1', maxCount: 1 },
  { name: 'image_2', maxCount: 1 },
]);

module.exports = { placeImageUpload };
