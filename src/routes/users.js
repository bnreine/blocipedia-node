const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


router.get("/users/signup", userController.signup);
console.log("before router")
router.post("/users", userController.create)
console.log("after router")

module.exports = router;
