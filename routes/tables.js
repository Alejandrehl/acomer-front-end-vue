const express = require("express");
const router = express.Router();
const Table = require("../models/Table");

// @route GET api/tables/:id
// @desc  Get tables of a branch, identified by its menu_id
// @access Public
router.get("/branch/:id", async (req, res) => {
  try {
    const tables = await Table.findAll({
      where: [{ branch_id: req.params.id }]
    });
    return res.status(200).json(tables);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
