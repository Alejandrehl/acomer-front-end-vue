const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ all: true, nested: true }]
    });
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// @route GET api/product/:id
// @desc    Get a single product
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ all: true, nested: true }]
    });
    return res.status(200).json({ product });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
