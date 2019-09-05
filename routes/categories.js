const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Product = require("../models/Product");

// @route GET api/categories
// @desc  Get all categories
// @access Public
router.get("/", async(req, res) => {
    try {
        const categories = await Category.findAll({
            include: [{ all: true, nested: true }]
        });
        return res.status(200).json(categories);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

// @route GET api/categories/id
// @desc  Get single categories
// @access Public
router.get("/:id", async(req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [{ all: true, nested: true }]
        })
        return res.status(200).json({ category });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

module.exports = router;