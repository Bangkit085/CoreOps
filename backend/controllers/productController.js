const db = require('../config/db');

// 1. Ambil semua produk
exports.getProducts = (req, res) => {
    db.query("SELECT * FROM products", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

// 2. Cari produk
exports.searchProduct = (req, res) => {
    const { nama } = req.query;
    db.query("SELECT * FROM products WHERE nama_alat LIKE ?", [`%${nama}%`], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

// 3. Tambah produk
exports.addProduct = (req, res) => {
    const { nama_alat, harga, spesifikasi_singkat, stok } = req.body;
    const gambar = req.file ? req.file.filename : null;

    db.query(
        "INSERT INTO products (nama_alat, harga, spesifikasi_singkat, stok, gambar_url) VALUES (?, ?, ?, ?, ?)",
        [nama_alat, harga, spesifikasi_singkat, stok, gambar],
        (err, result) => {
            if (err) {
                console.error("SQL Error addProduct:", err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Produk berhasil ditambah", id: result.insertId });
        }
    );
};

// 4. Update produk
exports.updateProduct = (req, res) => {
    const { nama_alat, harga, spesifikasi_singkat, stok } = req.body;
    const id = req.params.id;

    db.query(
        "UPDATE products SET nama_alat=?, harga=?, spesifikasi_singkat=?, stok=? WHERE id=?",
        [nama_alat, harga, spesifikasi_singkat, stok, id],
        (err, result) => {
            if (err) {
                console.error("SQL Error updateProduct:", err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Produk berhasil diupdate" });
        }
    );
};

// 5. Hapus produk
exports.deleteProduct = (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM products WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("SQL Error deleteProduct:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Produk berhasil dihapus" });
    });
};