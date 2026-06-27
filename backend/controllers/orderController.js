const db = require("../config/db");

// CHECKOUT — hanya untuk item yang dipilih (cart_ids), dengan validasi & pengurangan stok
exports.checkout = (req, res) => {
    const { user_id, cart_ids } = req.body;

    if (!user_id || !cart_ids || cart_ids.length === 0) {
        return res.status(400).json({ error: "user_id dan cart_ids wajib diisi" });
    }

    const sqlSelect = `
        SELECT cart.*, products.harga, products.stok, products.nama_alat
        FROM cart
        JOIN products ON cart.product_id = products.id
        WHERE cart.user_id = ? AND cart.id IN (?)
    `;

    db.query(sqlSelect, [user_id, cart_ids], (err, cartItems) => {
        if (err) {
            console.error("SQL Error checkout (select):", err);
            return res.status(500).json({ error: err.message });
        }

        if (cartItems.length === 0) {
            return res.status(400).json({ error: "Item tidak ditemukan di keranjang" });
        }

        const itemKurangStok = cartItems.find((item) => item.quantity > item.stok);
        if (itemKurangStok) {
            return res.status(400).json({
                error: `Stok ${itemKurangStok.nama_alat} tidak cukup (tersisa ${itemKurangStok.stok})`
            });
        }

        let total = 0;
        cartItems.forEach((item) => {
            total += Number(item.harga) * item.quantity;
        });

        db.query(
            `INSERT INTO orders (user_id, total_harga, status) VALUES (?, ?, ?)`,
            [user_id, total, "Menunggu Pembayaran"],
            (err, result) => {
                if (err) {
                    console.error("SQL Error checkout (insert order):", err);
                    return res.status(500).json({ error: err.message });
                }

                const orderId = result.insertId;

                cartItems.forEach((item) => {
                    db.query(
                        `INSERT INTO order_details (order_id, product_id, harga, qty) VALUES (?, ?, ?, ?)`,
                        [orderId, item.product_id, item.harga, item.quantity],
                        (err) => {
                            if (err) console.error("SQL Error insert order_details:", err);
                        }
                    );

                    db.query(
                        "UPDATE products SET stok = stok - ? WHERE id = ?",
                        [item.quantity, item.product_id],
                        (err) => {
                            if (err) console.error("SQL Error update stok:", err);
                        }
                    );
                });

                db.query(
                    "DELETE FROM cart WHERE id IN (?)",
                    [cart_ids],
                    (err) => {
                        if (err) console.error("SQL Error delete cart:", err);
                    }
                );

                res.json({ message: "Checkout berhasil", order_id: orderId });
            }
        );
    });
};

// RIWAYAT PESANAN CUSTOMER — order "Selesai" tampil di atas, urut dari yang terbaru diverifikasi
exports.getOrders = (req, res) => {
    const userId = req.params.userId;

    const sqlOrders = `
        SELECT * FROM orders
        WHERE user_id = ?
        ORDER BY 
            CASE WHEN status = 'Selesai' THEN 0 ELSE 1 END,
            verified_at DESC,
            id DESC
    `;

    db.query(sqlOrders, [userId], (err, orders) => {
        if (err) {
            console.error("SQL Error getOrders:", err);
            return res.status(500).json({ error: err.message });
        }

        if (orders.length === 0) return res.json([]);

        const orderIds = orders.map((o) => o.id);

        const sqlDetails = `
            SELECT order_details.order_id, order_details.qty, order_details.harga,
                   products.nama_alat, products.gambar_url
            FROM order_details
            JOIN products ON order_details.product_id = products.id
            WHERE order_details.order_id IN (?)
        `;

        db.query(sqlDetails, [orderIds], (err, details) => {
            if (err) {
                console.error("SQL Error getOrders (details):", err);
                return res.status(500).json({ error: err.message });
            }

            const result = orders.map((order) => ({
                ...order,
                items: details.filter((d) => d.order_id === order.id)
            }));

            res.json(result);
        });
    });
};