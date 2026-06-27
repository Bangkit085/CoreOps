const express = require("express");
const multer = require("multer");
const router = express.Router();

const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProduct
} = require("../controllers/productController");

// Konfigurasi Multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Rute-rute Produk
router.get("/", getProducts);
router.get("/search", searchProduct);

// POST: Tambah produk (menggunakan upload gambar)
router.post("/", upload.single("gambar"), addProduct);

// PUT: Update produk
router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;