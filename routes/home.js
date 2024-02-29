const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");

// Main Routes
router.get("/api", homeController.getApi);
router.get("/tables/:section", homeController.getSectionTables);
router.get("/getTable/:id", homeController.getTableInformation);
router.get("/getMenu/:location", homeController.getMenu);

module.exports = router;
