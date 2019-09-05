const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");

// @route   POST api/restaurants
// @desc    Create a restaurant
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const formData = req.body.formData;
    const { name, address, city, description } = formData;
    const imgUrl = req.body.imgUrl;
    const userId = req.body.id;

    const user = await User.findByPk(userId);

    restaurant = new Restaurant({
      name,
      description,
      userId: user.id,
      image: imgUrl,
      address,
      city
    });

    await restaurant.save();
    return res.status(200).json(restaurant);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// @route   GET api/restaurants
// @desc    Get all restaurants with limit & offset
// @access  Public
router.get("/:limit/:offset", async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      order: [["id", "DESC"]],
      limit: req.params.limit,
      offset: req.params.offset,
      where: { status: "approved" }
    });

    return res.status(200).json(restaurants);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// @route   GET api/restaurants
// @desc    Get all restaurants
// @access  Public
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: { status: "approved" }
    });
    return res.status(200).json(restaurants);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// @route   GET api/restaurants/top-five
// @desc    Get top five restaurants
// @access  Public
router.get("/top-five", async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      order: [["rating", "DESC"]],
      where: { status: "approved" },
      limit: 5
    });
    return res.status(200).json(restaurants);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
