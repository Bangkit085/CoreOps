import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [keyword, setKeyword] = useState("");

  const [namaAlat, setNamaAlat] = useState("");
  const [harga, setHarga] = useState("");
  const [spesifikasi, setSpesifikasi] = useState("");
  const [stok, setStok] = useState("");
  const [gambar, setGambar] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      loadProducts();
    }
  }, [navigate]);

  const loadProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Gagal memuat produk:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API_URL}/api/products/${editId}`, {
          nama_alat: namaAlat,
          harga: harga,
          spesifikasi_singkat: spesifikasi,
          stok: parseInt(stok)
        });
        alert("Produk berhasil diupdate!");
      } else {
        const formData = new FormData();
        formData.append("nama_alat", namaAlat);
        formData.append("harga", harga);
        formData.append("spesifikasi_singkat", spesifikasi);
        formData.append("stok", stok);
        if (gambar) formData.append("gambar", gambar);

        await axios.post(`${API_URL}/api/products`, formData);
        alert("Produk berhasil ditambahkan!");
      }

      setEditId(null);
      setNamaAlat(""); setHarga(""); setSpesifikasi(""); setStok(""); setGambar(null);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memproses data.");
    }
  };

  const hapusProduk = async (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      await axios.delete(`${API_URL}/api/products/${id}`);
      loadProducts();
    }
  };

  const filteredProducts = products.filter((item) =>
    item.nama_alat.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="bg-light min-vh-100">
      <Navbar showSearch={true} onSearch={setKeyword} isAdmin={true} />

      <div className="container mt-4">
        <h2 className="mb-4">Dashboard Admin</h2>

        <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <input className="form-control" placeholder="Nama Produk" value={namaAlat} onChange={(e) => setNamaAlat(e.target.value)} required />
            </div>
            <div className="col-md-3">
              <input type="number" className="form-control" placeholder="Harga" value={harga} onChange={(e) => setHarga(e.target.value)} required />
            </div>
            <div className="col-md-3">
              <input type="number" className="form-control" placeholder="Stok" value={stok} onChange={(e) => setStok(e.target.value)} required />
            </div>
          </div>
          <textarea className="form-control my-2" placeholder="Spesifikasi" value={spesifikasi} onChange={(e) => setSpesifikasi(e.target.value)} />
          <input type="file" className="form-control mb-2" onChange={(e) => setGambar(e.target.files[0])} />

          <div className="d-flex">
            <button className={`btn ${editId ? "btn-warning" : "btn-success"}`}>
              {editId ? "Update Produk" : "Tambah Produk"}
            </button>
            {editId && (
              <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditId(null)}>Batal</button>
            )}
          </div>
        </form>

        {keyword && (
          <div className="mb-2">
            <small className="text-muted">Hasil pencarian untuk: <strong>"{keyword}"</strong></small>
          </div>
        )}

        <table className="table table-bordered bg-white shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Foto</th>
              <th>Nama</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <tr key={item.id} className="align-middle">
                  <td><img src={`${API_URL}/uploads/${item.gambar_url}`} width="60" className="rounded" alt={item.nama_alat} /></td>
                  <td>{item.nama_alat}</td>
                  <td>Rp{Number(item.harga).toLocaleString()}</td>
                  <td><span className="badge bg-primary">{item.stok}</span></td>
                  <td>
                    <button onClick={() => { setEditId(item.id); setNamaAlat(item.nama_alat); setHarga(item.harga); setSpesifikasi(item.spesifikasi_singkat); setStok(item.stok); window.scrollTo(0, 0); }} className="btn btn-warning btn-sm me-2">Edit</button>
                    <button onClick={() => hapusProduk(item.id)} className="btn btn-danger btn-sm">Hapus</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">Produk tidak ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;