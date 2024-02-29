const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment");

// Payment Routes
router.get("/config", paymentController.getConfig);
router.post("/createPaymentIntent", paymentController.createPayment);
router.post("/createReceipt", paymentController.createReceipt);
router.put("/deleteTableInfo", paymentController.deleteTableInfo);

module.exports = router;
