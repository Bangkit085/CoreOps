import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

function AdminOrderHistory() {
  const [verifiedOrders, setVerifiedOrders] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/orders/verified`)
      .then((res) => setVerifiedOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-light min-vh-100">
      <Navbar showSearch={true} isAdmin={true} onSearch={() => {}} />
      <div className="container mt-4">
        <h3 className="mb-4">Riwayat Pesanan Terverifikasi</h3>

        {verifiedOrders.length === 0 ? (
          <div className="alert alert-info">Belum ada pesanan yang terverifikasi.</div>
        ) : (
          verifiedOrders.map((order) => (
            <div key={order.order_id} className="card mb-3 p-3 shadow-sm border-0">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <h5 className="mb-0">Order #{order.order_id}</h5>
                  <small className="text-muted">Pemesan: {order.nama_user}</small>
                </div>
                <span className="badge bg-success">{order.status}</span>
              </div>

              {order.items.map((item, idx) => (
                <div key={idx} className="d-flex align-items-center mb-2">
                  <img
                    src={`${API_URL}/uploads/${item.gambar_url}`}
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
              <div className="d-flex justify-content-between">
                <small className="text-primary">
                  Dibuat: {new Date(order.created_at).toLocaleString("id-ID")}
                </small>
                <strong>Total: Rp{Number(order.total_harga).toLocaleString()}</strong>
              </div>
              {order.verified_at && (
                <small className="text-success d-block mt-1">
                  Diverifikasi: {new Date(order.verified_at).toLocaleString("id-ID")}
                </small>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminOrderHistory;