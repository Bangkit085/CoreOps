const db = require("../config/db");

// Ambil semua order yang masih menunggu pembayaran (untuk diverifikasi admin)
exports.getPendingOrders = (req, res) => {
    const sql = `
        SELECT orders.id AS order_id, orders.user_id, orders.total_harga, orders.status, orders.created_at,
               users.username AS nama_user,
               order_details.qty, order_details.harga,
               products.nama_alat, products.gambar_url
        FROM orders
        JOIN users ON orders.user_id = users.id
        JOIN order_details ON order_details.order_id = orders.id
        JOIN products ON order_details.product_id = products.id
        WHERE orders.status = 'Menunggu Pembayaran'
        ORDER BY orders.id DESC
    `;

    db.query(sql, (err, rows) => {
        if (err) {
            console.error("SQL Error getPendingOrders:", err);
            return res.status(500).json({ error: err.message });
        }

        const grouped = {};
        rows.forEach((row) => {
            if (!grouped[row.order_id]) {
                grouped[row.order_id] = {
                    order_id: row.order_id,
                    user_id: row.user_id,
                    nama_user: row.nama_user,
                    total_harga: row.total_harga,
                    status: row.status,
                    created_at: row.created_at,
                    items: []
                };
            }
            grouped[row.order_id].items.push({
                nama_alat: row.nama_alat,
                gambar_url: row.gambar_url,
                qty: row.qty,
                harga: row.harga
            });
        });

        res.json(Object.values(grouped));
    });
};

// Verifikasi pembayaran -> ubah status jadi Selesai + catat waktu verifikasi
exports.verifyOrder = (req, res) => {
    const { id } = req.params;

    db.query(
        "UPDATE orders SET status = 'Selesai', verified_at = NOW() WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                console.error("SQL Error verifyOrder:", err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Pembayaran diverifikasi, pesanan selesai" });
        }
    );
};

// Riwayat semua order yang sudah terverifikasi (selesai), urut dari yang terbaru diverifikasi
exports.getVerifiedOrders = (req, res) => {
    const sql = `
        SELECT orders.id AS order_id, orders.user_id, orders.total_harga, orders.status, 
               orders.created_at, orders.verified_at,
               users.username AS nama_user,
               order_details.qty, order_details.harga,
               products.nama_alat, products.gambar_url
        FROM orders
        JOIN users ON orders.user_id = users.id
        JOIN order_details ON order_details.order_id = orders.id
        JOIN products ON order_details.product_id = products.id
        WHERE orders.status = 'Selesai'
        ORDER BY orders.verified_at DESC
    `;

    db.query(sql, (err, rows) => {
        if (err) {
            console.error("SQL Error getVerifiedOrders:", err);
            return res.status(500).json({ error: err.message });
        }

        const grouped = {};
        rows.forEach((row) => {
            if (!grouped[row.order_id]) {
                grouped[row.order_id] = {
                    order_id: row.order_id,
                    user_id: row.user_id,
                    nama_user: row.nama_user,
                    total_harga: row.total_harga,
                    status: row.status,
                    created_at: row.created_at,
                    verified_at: row.verified_at,
                    items: []
                };
            }
            grouped[row.order_id].items.push({
                nama_alat: row.nama_alat,
                gambar_url: row.gambar_url,
                qty: row.qty,
                harga: row.harga
            });
        });

        res.json(Object.values(grouped));
    });
};