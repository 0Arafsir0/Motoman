const express = require("express");

const {
    getSalesReport,
    getProfitReport
} = require("../controllers/reportController");

const router = express.Router();

router.get("/sales", getSalesReport);

router.get("/profit", getProfitReport);

module.exports = router;