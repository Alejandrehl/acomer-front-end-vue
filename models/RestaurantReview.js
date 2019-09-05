const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");
const sequelize = new Sequelize(db);
const User = require("./User");
const Restaurant = require("./Restaurant");

const RestaurantReview = sequelize.define(
  "restaurant_review",
  {
    title: { type: Sequelize.STRING, allowNull: false },
    review: { type: Sequelize.TEXT, allowNull: false },
    stars: { type: Sequelize.INTEGER, allowNull: false },
    created_at: { type: Sequelize.DATE, defaultValue: Date.now },
    updated_at: { type: Sequelize.DATE, defaultValue: Date.now }
  },
  {
    timestamps: false,
    underscored: true
  }
);

RestaurantReview.belongsTo(User);
RestaurantReview.belongsTo(Restaurant);

module.exports = RestaurantReview;
