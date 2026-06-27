import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL = import.meta.env.VITE_API_URL;

const Orders = () => {
  const [riwayat, setRiwayat] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios.get(`${API_URL}/api/orders/${userId}`)
      .then(res => setRiwayat(res.data))
      .catch(err => console.error("Gagal:", err));
  }, []);

  const filteredRiwayat = riwayat.filter(order =>
    String(order.id).includes(searchTerm) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar showBack={true} showSearch={true} onSearch={setSearchTerm} hideOrders={true} />

      <div className="container mt-4">
        <h3 className="mb-4">Riwayat Pesanan</h3>

        {filteredRiwayat.length === 0 ? (
          <div className="alert alert-info">Belum ada riwayat pesanan.</div>
        ) : (
          <div className="list-group">
            {filteredRiwayat.map((order) => (
              <div key={order.id} className="card mb-3 p-3 shadow-sm border-0">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0">Order #{order.id}</h5>
                  <span className={`badge ${order.status.toLowerCase() === 'selesai' ? 'bg-success' : 'bg-warning'}`}>
                    {order.status}
                  </span>
                </div>

                {(order.items || []).map((item, idx) => (
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
                    {new Date(order.created_at).toLocaleString("id-ID")}
                  </small>
                  <strong>Total: Rp{Number(order.total_harga).toLocaleString()}</strong>
                </div>

                {order.status.toLowerCase() === 'selesai' && order.verified_at && (
                  <small className="text-success d-block mt-1">
                    Diverifikasi: {new Date(order.verified_at).toLocaleString("id-ID")}
                  </small>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;