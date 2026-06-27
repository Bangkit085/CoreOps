const express = require("express");
const router = express.Router();

const {
    getPendingOrders,
    verifyOrder,
    getVerifiedOrders
} = require("../controllers/adminOrderController");

router.get("/pending", getPendingOrders);
router.put("/verify/:id", verifyOrder);
router.get("/verified", getVerifiedOrders);

module.exports = router;