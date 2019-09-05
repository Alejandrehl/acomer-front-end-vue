const express = require("express");
const router = express.Router();
const Reserve = require("../models/Reserve");

// @route GET api/reserves/user/:id
// @desc    Get a single product
// @access Public
router.get("/user/:id", async (req, res) => {
  try {
    const reserves = await Reserve.findAll({
      where: [{ user_id: req.params.id }],
      include: [{ all: true, nested: true }]
    });
    return res.status(200).json(reserves);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// @route GET api/reserves/:id
// @desc    Get a single product
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const reserve = await Reserve.findByPk(req.params.id, {
      include: [{ all: true, nested: true }]
    });
    return res.status(200).json({ reserve });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
