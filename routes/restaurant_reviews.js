const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const RestaurantReview = require("../models/RestaurantReview");
const Restaurant = require("../models/Restaurant");

// @route   POST api/restaurant-reviews
// @desc    Create a restaurant review
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { restaurantId, stars } = req.body;

    const restaurant_review = new RestaurantReview(req.body);
    await restaurant_review.save();

    const restaurant = await Restaurant.findByPk(restaurantId);
    const { rating_total, quantity_voting } = restaurant;

    restaurant.rating_total = rating_total + stars;
    restaurant.quantity_voting = quantity_voting + 1;
    restaurant.rating = restaurant.rating_total / restaurant.quantity_voting;
    await restaurant.save();

    return res.status(200).json(restaurant_review);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// @route   GET api/restaurant-reviews/:restaurantId/:userId
// @desc    Get user reviews for specify restaurant
// @access  Private
router.get("/:restaurant_id/:user_id", auth, async (req, res) => {
  try {
    const { restaurant_id, user_id } = req.params;
    const reviews = await RestaurantReview.findAll({
      where: { restaurantId: restaurant_id, userId: user_id }
    });
    return res.status(200).json(reviews);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// @route   GET api/restaurant-reviews/:restaurantId/reviews
// @desc    Get restaurant reviews
// @access  Public
router.get("/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reviews = await RestaurantReview.findAll({
      where: { restaurantId },
      order: [["id", "DESC"]],
      include: [{ all: true, nested: true }]
    });
    return res.status(200).json(reviews);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
