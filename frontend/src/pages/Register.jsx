import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// Import ikon untuk hide/show password
import { IoEye, IoEyeOff } from "react-icons/io5";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State untuk kontrol tampilan password
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      alert("Semua field wajib diisi");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
        role: "Customer",
      });
      alert("Register berhasil");
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Register gagal");
    }
  };

  return (
    <div style={{ backgroundColor: "#0056b3", minHeight: "100vh" }}>
      {/* Navbar Putih dengan Teks Biru */}
      <nav className="navbar navbar-light bg-white px-5 shadow-sm">
        <Link className="navbar-brand fw-bold fs-3 text-primary" to="/">CoreOps Space</Link>
      </nav>

      <div className="container mt-5">
        <div className="row align-items-center" style={{ minHeight: "70vh" }}>
          <div className="col-md-6 text-white p-5 d-none d-md-block">
            <h1>Register</h1>
            <p className="fs-5">Daftarkan akun Anda dan mulai berbelanja di CoreOps Space.</p>
          </div>
          <div className="col-md-5 offset-md-1">
            {/* Card form berwarna Putih */}
            <div className="card shadow-lg p-4 border-0 rounded-3">
              <h4 className="mb-4">Daftar Akun</h4>
              <form onSubmit={submit}>
                <input
                  type="text"
                  className="form-control mb-3 p-3"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="email"
                  className="form-control mb-3 p-3"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                
                {/* Input Password dengan fitur Hide/Show */}
                <div className="input-group mb-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control p-3"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="input-group-text bg-white"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoEyeOff size={22} /> : <IoEye size={22} />}
                  </span>
                </div>

                <button type="submit" className="btn btn-primary w-100 p-2 fw-bold">Register</button>
              </form>
              
              <div className="mt-3 text-center">
                Sudah punya akun? <Link to="/login" className="text-primary fw-bold">Login</Link> / 
                <Link to="/" className="text-primary fw-bold"> Kembali</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;