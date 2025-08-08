const express = require("express");
const router = express.Router();
const {auth}  = require("../middleware/auth")
const { register, login } = require("../controllers/authController"); // Import controller function

router.post("/register", register); // Route for registration
router.post("/login",login); //Route for login

router.get("/auth/me", auth,  async (req, res) => {
  res.json(req.user)
})

module.exports = router; // Export for use in server.js
