const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");
const sequelize = new Sequelize(db);

const CategoryMenu = sequelize.define(
  "categories_menus",
  {
    created_at: { type: Sequelize.DATE, defaultValue: Date.now },
    updated_at: { type: Sequelize.DATE, defaultValue: Date.now }
  },
  {
    timestamps: false,
    underscored: true
  }
);

module.exports = CategoryMenu;
