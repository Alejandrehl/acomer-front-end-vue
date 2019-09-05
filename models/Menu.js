const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");
const sequelize = new Sequelize(db);
const Branch = require("./Branch");
const Category = require("./Category");
const CategoryMenu = require("./CategoryMenu");

const Menu = sequelize.define(
  "menus",
  {
    name: { type: Sequelize.STRING, allowNull: true },
    img_url: { type: Sequelize.STRING, allowNull: true },
    description: { type: Sequelize.TEXT, allowNull: true },
    created_at: { type: Sequelize.DATE, defaultValue: Date.now },
    updated_at: { type: Sequelize.DATE, defaultValue: Date.now }
  },
  {
    timestamps: false,
    underscored: true
  }
);

Menu.belongsTo(Branch);
Menu.belongsToMany(Category, { through: CategoryMenu });

module.exports = Menu;
