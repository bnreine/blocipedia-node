const express = require("express");
const router = express.Router();
 const staticController = require("../controllers/staticController");

console.log("route")
router.get("/", staticController.index);

module.exports = router;
