const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");

// Main Routes
router.post("/login", homeController.login);
router.post("/logout", homeController.logout);
router.get("/getSectionTables/:section", homeController.getSectionTables);

module.exports = router;
