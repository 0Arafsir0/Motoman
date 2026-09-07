const express = require("express");

const {
    createSale,
    getSales,
    getSale,
    deleteSale
} = require("../controllers/saleController");

const router = express.Router();

router.post("/", createSale);

router.get("/", getSales);

router.get("/:id", getSale);

router.delete("/:id", deleteSale);

module.exports = router;