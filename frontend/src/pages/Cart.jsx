import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Cart() {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const userId = localStorage.getItem("userId");

  const loadCart = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadCart(); }, [userId]);

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return;
    await axios.put(`http://localhost:5000/api/cart/${id}`, { kuantitas: newQty });
    loadCart();
  };

  const handleOrder = async () => {
    try {
      await axios.post("http://localhost:5000/api/orders/checkout", {
        user_id: userId,
        cart_ids: selectedItems
      });
      alert("Order Berhasil!");
      loadCart();
      setSelectedItems([]);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || "Gagal Checkout";
      alert(msg);
    }
  };

  const filteredItems = items.filter(i =>
    i.nama_alat.toLowerCase().includes(keyword.toLowerCase())
  );

  const grandTotal = items
    .filter(i => selectedItems.includes(i.id))
    .reduce((acc, item) => acc + (Number(item.harga) * (item.quantity || 1)), 0);

  return (
    <div className="bg-light min-vh-100">
      <Navbar showBack={true} showSearch={true} onSearch={setKeyword} hideCart={true} />
      <div className="container mt-4">
        <h3>Keranjang Belanja</h3>
        {items.length === 0 ? (
          <div className="text-center mt-5"><h5>Keranjang Kosong</h5></div>
        ) : (
          <>
            {filteredItems.map(item => (
              <div className="card mb-3 p-3 shadow-sm" key={item.id}>
                <div className="row align-items-center">
                  <div className="col-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedItems.includes(item.id)}
                      onChange={() =>
                        setSelectedItems(prev =>
                          prev.includes(item.id)
                            ? prev.filter(i => i !== item.id)
                            : [...prev, item.id]
                        )
                      }
                    />
                  </div>
                  <div className="col-2">
                    <img src={`http://localhost:5000/uploads/${item.gambar_url}`} width="60" />
                  </div>
                  <div className="col-3">
                    <h6>{item.nama_alat}</h6>
                    <small>Rp{Number(item.harga).toLocaleString()}</small>
                  </div>
                  <div className="col-2 d-flex align-items-center">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >-</button>
                    <span className="mx-3 fw-bold">{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >+</button>
                  </div>
                  <div className="col-2 text-primary fw-bold">
                    Rp{(Number(item.harga) * item.quantity).toLocaleString()}
                  </div>
                  <div className="col-2 text-end">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => axios.delete(`http://localhost:5000/api/cart/${item.id}`).then(loadCart)}
                    >Hapus</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-white p-4 mt-4 rounded shadow-sm d-flex justify-content-between">
              <h5>Total: Rp{grandTotal.toLocaleString()}</h5>
              <button
                className="btn btn-success"
                disabled={selectedItems.length === 0}
                onClick={handleOrder}
              >Order Sekarang</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;