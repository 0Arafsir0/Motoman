const express = require("express");

const {
    addBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand
} = require("../controllers/brandController");

const router = express.Router();

router.post("/", addBrand);

router.get("/", getBrands);

router.get("/:id", getBrand);

router.put("/:id", updateBrand);

router.delete("/:id", deleteBrand);

module.exports = router;