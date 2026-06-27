import {
 BrowserRouter,
 Routes,
 Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AdminCart from "./pages/AdminCart";
import AdminOrderHistory from "./pages/AdminOrderHistory";
function App(){

 return(

  <BrowserRouter>

   <Routes>

    <Route
     path="/login"
     element={<Login />}
    />

    <Route
     path="/register"
     element={<Register />}
    />

    <Route
     path="/admin"
     element={<AdminDashboard />}
    />

    <Route
     path="/"
     element={<Home />}
    />

    <Route
     path="/navbar"
     element={<Navbar />}
    />
    <Route
     path="/cart"
     element={<Cart />}
    />
    <Route
     path="/orders"
     element={<Orders />}
    />

    <Route path="/admin/cart" 
    element={<AdminCart />} 
    />
    <Route path="/admin/orders-history" 
    element={<AdminOrderHistory />}
    />

   </Routes>

  </BrowserRouter>

 );

}

export default App;