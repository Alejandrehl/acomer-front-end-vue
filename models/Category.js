const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");
const sequelize = new Sequelize(db);
const Product = require("./Product");
const CategoryProduct = require("./CategoryProduct");

const Category = sequelize.define(
    "categories", {
        name: { type: Sequelize.STRING, allowNull: true },
        description: { type: Sequelize.TEXT, allowNull: false },
        img_url: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, defaultValue: Date.now },
        updated_at: { type: Sequelize.DATE, defaultValue: Date.now }
    }, {
        timestamps: false,
        underscored: true
    }
);

Category.belongsToMany(Product, { through: CategoryProduct });
module.exports = Category;