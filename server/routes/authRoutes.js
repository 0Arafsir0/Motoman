const express = require("express");

const {
    createAdmin,
    login
} = require("../controllers/authController");

const router = express.Router();

router.post("/create-admin", createAdmin);
router.post("/login", login);

module.exports = router;