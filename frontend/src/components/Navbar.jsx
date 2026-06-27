import { Link, useNavigate } from "react-router-dom";
import { IoListOutline, IoCartOutline, IoArrowBack } from "react-icons/io5";

function Navbar({
  showBack = false,
  onSearch,
  showSearch = false,
  hideOrders = false,
  hideCart = false,
  isAdmin = false
}) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email") || "user@example.com";

  const logout = () => { localStorage.clear(); navigate("/login"); };

  const cartLink = isAdmin ? "/admin/cart" : "/cart";
  const ordersLink = isAdmin ? "/admin/orders-history" : "/orders";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top" style={{ backgroundColor: "#0056b3" }}>
      <div className="container">
        {showBack && (
          <button className="btn btn-light btn-sm text-primary me-3" onClick={() => navigate(-1)}>
            <IoArrowBack />
          </button>
        )}

        <Link className="navbar-brand fw-bold text-white" to={isAdmin ? "/admin" : "/"}>CoreOps Space</Link>

        <div className="navbar-nav ms-auto d-flex align-items-center flex-row">
          {showSearch && (
            <div className="input-group me-3" style={{ width: "250px" }}>
              <input type="text" className="form-control" placeholder="Cari..." onChange={(e) => onSearch(e.target.value)} />
              <button className="btn btn-outline-light" type="button">Cari</button>
            </div>
          )}

          {username ? (
            <div className="d-flex align-items-center">
              {!hideCart && (
                <Link className="nav-link text-white me-3" to={cartLink}>
                  <IoCartOutline size={22} />
                </Link>
              )}

              {!hideOrders && (
                <Link className="nav-link text-white me-3" to={ordersLink}>
                  <IoListOutline size={22} />
                </Link>
              )}

              <div className="dropdown">
                <button className="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                  <img src={localStorage.getItem("profilePic") || "https://ui-avatars.com/api/?name=" + username} className="rounded-circle me-2" width="25" height="25" alt="Profile" />
                  <span className="me-2">{username}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end p-2" style={{ width: "220px" }}>
                  <li className="px-2">
                    <div className="fw-bold">{username}</div>
                    <div className="text-muted small">{email}</div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li className="d-flex justify-content-between px-2">
                    <Link className="btn btn-sm btn-outline-primary w-45" to="/profile">Update</Link>
                    <button className="btn btn-sm btn-outline-danger w-45" onClick={logout}>Logout</button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <Link className="nav-link text-white me-2" to="/login">Login</Link>
              <Link className="nav-link text-white btn btn-outline-light btn-sm" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;