const express = require("express");
const router = express.Router();

const {
  createUnit,
  getUnits,
  getUnitsByProperty,
  getUnitById,
  updateUnit,
  deleteUnit,
  deleteUnitImage,
  assignTenantToUnit,
  vacateUnit,
} = require("../controllers/unitController");

const multer = require("multer");
const path = require("path");

// ==============================
// MULTER CONFIG
// ==============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// ==============================
// UNIT ROUTES
// ==============================

router.post("/", upload.array("images", 10), createUnit);
router.get("/", getUnits);
router.get("/property/:propertyId", getUnitsByProperty);
router.get("/:id", getUnitById);

router.put("/:id", upload.array("images", 10), updateUnit);
router.delete("/:id", deleteUnit);
router.delete("/:id/image", deleteUnitImage);

router.post("/:id/assign", assignTenantToUnit);
router.patch("/:id/vacate", vacateUnit);

module.exports = router;
