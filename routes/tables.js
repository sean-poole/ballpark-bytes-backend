const express = require("express");
const router = express.Router();
const tablesController = require("../controllers/tables");

// Tables Routes
router.get("/getMenu/:location", tablesController.getMenu);
router.put("/addItem", tablesController.addItem);
router.put("/removeItem", tablesController.removeItem);
router.put("/applyDiscount", tablesController.applyDiscount);

module.exports = router;
