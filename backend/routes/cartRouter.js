const express = require("express");
const router = express.Router();
const { 
    addToCart, 
    getCart, 
    deleteCart, 
    updateCart
} = require("../controllers/cartController");

router.post("/", addToCart);
router.get("/:userId", getCart);
router.delete("/:id", deleteCart);
router.put("/:id", updateCart);

module.exports = router;