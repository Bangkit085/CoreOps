const db = require('../config/db');

// Mengambil data keranjang
exports.getCart = (req, res) => {
    const userId = req.params.userId;
    const sql = `SELECT cart.id, cart.product_id, products.nama_alat, products.harga, products.gambar_url, cart.quantity 
                 FROM cart 
                 JOIN products ON cart.product_id = products.id 
                 WHERE cart.user_id = ?`;
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

// Menambah produk (dengan penanganan duplikasi otomatis lewat UNIQUE KEY)
exports.addToCart = (req, res) => {
    const { user_id, product_id, kuantitas } = req.body;
    const qty = kuantitas || 1;

    const sql = `
        INSERT INTO cart (user_id, product_id, quantity) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + ?
    `;

    db.query(sql, [user_id, product_id, qty, qty], (err, result) => {
        if (err) {
            console.error("SQL Error addToCart:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Berhasil ditambahkan/diupdate" });
    });
};

// Update jumlah barang (di halaman Cart)
exports.updateCart = (req, res) => {
    const { id } = req.params;
    const { kuantitas } = req.body;
    db.query("UPDATE cart SET quantity = ? WHERE id = ?", [kuantitas, id], (err) => {
        if (err) {
            console.error("SQL Error updateCart:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Kuantitas diperbarui" });
    });
};

// Hapus 1 item dari cart
exports.deleteCart = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM cart WHERE id = ?", [id], (err) => {
        if (err) {
            console.error("SQL Error deleteCart:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Dihapus" });
    });
};