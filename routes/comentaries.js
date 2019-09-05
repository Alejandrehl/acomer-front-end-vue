const express = require("express");
const router = express.Router();
const Comentary = require("../models/Comentary");

// @route GET api/comentaries/:id
// @desc  Get comentaries of a product
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const comentaries = await Comentary.findAll({
      where: [{ product_id: req.params.id }]
    });
    return res.status(200).json(comentaries);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
