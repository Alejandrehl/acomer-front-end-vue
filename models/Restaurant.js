const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");
const sequelize = new Sequelize(db);
const User = require("./User");

const Restaurant = sequelize.define(
  "restaurants",
  {
    name: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: false },
    business_name: { type: Sequelize.STRING, allowNull: true },
    giro: { type: Sequelize.STRING, allowNull: true },
    telephone: { type: Sequelize.STRING, allowNull: true },
    email: { type: Sequelize.STRING, allowNull: true },
    instagram: { type: Sequelize.STRING, allowNull: true },
    facebook: { type: Sequelize.STRING, allowNull: true },
    twitter: { type: Sequelize.STRING, allowNull: true },
    pinterest: { type: Sequelize.STRING, allowNull: true },
    tripadvisor: { type: Sequelize.STRING, allowNull: true },
    created_at: { type: Sequelize.DATE, defaultValue: Date.now },
    updated_at: { type: Sequelize.DATE, defaultValue: Date.now },
    image: { type: Sequelize.STRING, allowNull: false },
    address: { type: Sequelize.STRING, allowNull: false },
    city: { type: Sequelize.STRING, allowNull: false },
    rating: { type: Sequelize.INTEGER, allowNull: true },
    rating_total: { type: Sequelize.INTEGER, allowNull: true },
    quantity_voting: { type: Sequelize.INTEGER, allowNull: true },
    status: { type: Sequelize.STRING, allowNull: true }
  },
  {
    timestamps: false,
    underscored: true
  }
);

Restaurant.belongsTo(User);

module.exports = Restaurant;
