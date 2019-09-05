const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");
const sequelize = new Sequelize(db);

const CategoryProduct = sequelize.define(
  "categories_products",
  {},
  {
    timestamps: false,
    underscored: true
  }
);

module.exports = CategoryProduct;
