// routes/UserRoutes.js
const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getUsers } = require("../Controller/UserController");

// ✅ Remove the /users prefix — it's already added in index.js via app.use("/api/users", ...)
router.post("/register", registerUser);   // → /api/users/register ✅
router.post("/login", loginUser);         // → /api/users/login ✅
router.get("/", getUsers);               // → /api/users ✅

module.exports = router;