import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function AdminCart() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const loadPending = () => {
    axios.get("http://localhost:5000/api/admin/orders/pending")
      .then((res) => setPendingOrders(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => { loadPending(); }, []);

  const handleVerify = async (orderId) => {
    if (loadingId === orderId) return;
    setLoadingId(orderId);
    try {
      await axios.put(`http://localhost:5000/api/admin/orders/verify/${orderId}`);
      alert("Pembayaran diverifikasi!");
      loadPending();
    } catch (err) {
      console.error(err);
      alert("Gagal memverifikasi pembayaran");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <Navbar showSearch={true} isAdmin={true} onSearch={() => {}} />
      <div className="container mt-4">
        <h3 className="mb-4">Verifikasi Pembayaran</h3>

        {pendingOrders.length === 0 ? (
          <div className="alert alert-info">Tidak ada pesanan yang menunggu pembayaran.</div>
        ) : (
          pendingOrders.map((order) => (
            <div key={order.order_id} className="card mb-3 p-3 shadow-sm border-0">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <h5 className="mb-0">Order #{order.order_id}</h5>
                  <small className="text-muted">Pemesan: {order.nama_user}</small>
                </div>
                <span className="badge bg-warning">{order.status}</span>
              </div>

              {order.items.map((item, idx) => (
                <div key={idx} className="d-flex align-items-center mb-2">
                  <img
                    src={`http://localhost:5000/uploads/${item.gambar_url}`}
                    alt={item.nama_alat}
                    width="50"
                    height="50"
                    style={{ objectFit: "cover", borderRadius: "6px" }}
                    className="me-3"
                  />
                  <div className="flex-grow-1">
                    <div className="fw-bold">{item.nama_alat}</div>
                    <small className="text-muted">
                      {item.qty} x Rp{Number(item.harga).toLocaleString()}
                    </small>
                  </div>
                </div>
              ))}

              <hr className="my-2" />
              <div className="d-flex justify-content-between align-items-center">
                <strong>Total: Rp{Number(order.total_harga).toLocaleString()}</strong>
                <button
                  className="btn btn-success"
                  disabled={loadingId === order.order_id}
                  onClick={() => handleVerify(order.order_id)}
                >
                  {loadingId === order.order_id ? "Memverifikasi..." : "Verifikasi Pembayaran"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminCart;