const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// @route GET api/orders/:id
// @desc    Get a single order
// @access Public
router.get("/:id", async(req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [{ all: true, nested: true }]
        });
        return res.status(200).json({ order });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

module.exports = router;