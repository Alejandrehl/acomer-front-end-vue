const express = require("express");
const router = express.Router();
const Branch = require("../models/Branch");
const Menu = require("../models/Menu");

// @route GET api/branches
// @desc    Get all branches
// @access Public
router.get("/", async (req, res) => {
  try {
    const branches = await Branch.findAll({
      include: [{ all: true, nested: true }]
    });
    return res.status(200).json(branches);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id, {
      include: [{ all: true, nested: true }]
    });
    const menus = await Menu.findAll({ where: [{ branch_id: branch.id }] });
    return res.status(200).json({ branch, menus });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
