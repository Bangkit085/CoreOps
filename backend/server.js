require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRouters = require("./routes/authRouters");
const productRouters = require("./routes/productRouters");
const cartRoutes = require("./routes/cartRouter");
const orderRouter = require("./routes/orderRouter");
const adminOrderRouter = require("./routes/adminOrderRouter");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRouters);
app.use("/api/products", productRouters);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.listen(process.env.PORT, () => {
  console.log(`Server Running on Port ${process.env.PORT}`);
});