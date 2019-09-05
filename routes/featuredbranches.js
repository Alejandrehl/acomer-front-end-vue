const express = require("express");
const router = express.Router();
const FeaturedBranch = require("../models/FeaturedBranch");

// @route GET api/featuredbranches
// @desc    Get all branches
// @access Public
router.get("/", async (req, res) => {
  try {
    const featuredBranches = await FeaturedBranch.findAll({
      include: [{ all: true, nested: true }]
    });
    return res.status(200).json(featuredBranches);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
