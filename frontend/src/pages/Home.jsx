import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const loadProducts = () => {
    axios.get(`${API_URL}/api/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => { loadProducts(); }, []);

  const addToCart = async (id) => {
    const userId = localStorage.getItem("userId");
    if (!userId) { alert("Silakan login terlebih dahulu"); return; }
    if (loadingId === id) return;

    setLoadingId(id);
    try {
      await axios.post(`${API_URL}/api/cart`, {
        user_id: userId,
        product_id: id,
        kuantitas: 1
      });
      alert("Produk berhasil masuk keranjang");
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan ke keranjang");
    } finally {
      setLoadingId(null);
    }
  };

  const filteredProducts = products.filter((item) =>
    item.nama_alat.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="bg-light min-vh-100">
      <Navbar showSearch={true} onSearch={setKeyword} />

      <div className="container mt-4">
        {keyword && (
          <div className="mb-3">
            <h5 className="text-muted">Hasil pencarian untuk: <span className="text-primary">"{keyword}"</span></h5>
          </div>
        )}

        <div className="row">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <div className="col-md-3 mb-4" key={item.id}>
                <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
                  <img
                    src={`${API_URL}/uploads/${item.gambar_url}`}
                    className="card-img-top"
                    alt={item.nama_alat}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title fw-bold">{item.nama_alat}</h6>
                    <p className="text-primary fw-bold">Rp{Number(item.harga).toLocaleString()}</p>
                    <p className="text-muted small flex-grow-1">{item.spesifikasi_singkat}</p>

                    <p className={`small fw-bold ${item.stok > 0 ? "text-success" : "text-danger"}`}>
                      {item.stok > 0 ? `Stok: ${item.stok}` : "Stok Habis"}
                    </p>

                    <button
                      className="btn btn-outline-primary w-100 mt-auto"
                      onClick={() => addToCart(item.id)}
                      disabled={loadingId === item.id || item.stok <= 0}
                    >
                      {loadingId === item.id
                        ? "Menambahkan..."
                        : item.stok <= 0
                        ? "Stok Habis"
                        : "Tambah ke Keranjang"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center mt-5">
              <h5>Produk "{keyword}" tidak ditemukan.</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;