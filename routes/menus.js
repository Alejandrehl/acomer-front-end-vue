const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");
const Category = require("../models/Category");
const CategoryMenu = require("../models/CategoryMenu");

// @route GET api/menus
// @desc    Get all menus
// @access Public
router.get("/", async (req, res) => {
  try {
    const menus = await Menu.findAll({
      include: [{ all: true, nested: true }]
    });
    return res.status(200).json({ menus });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const menu = await Menu.findByPk(req.params.id, {
      include: [{ all: true, nested: true }]
    });
    return res.status(200).json({ menu });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
