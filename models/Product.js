const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");
const sequelize = new Sequelize(db);
const ImageProductPath = require("../models/ImageProductPath");

const Product = sequelize.define(
    "products", {
        name: { type: Sequelize.STRING, allowNull: true },
        description: { type: Sequelize.STRING, allowNull: true },
        price: { type: Sequelize.STRING, allowNull: true },
        img_url: { type: Sequelize.STRING, allowNull: true },
        cost: { type: Sequelize.STRING, allowNull: true },
        description: { type: Sequelize.TEXT, allowNull: true },
        ingredient: { type: Sequelize.STRING, allowNull: true },
        vegan: { type: Sequelize.STRING, allowNull: true },
        vegetarian: { type: Sequelize.STRING, allowNull: true },
        specialty: { type: Sequelize.STRING, allowNull: true },
        value_offer: { type: Sequelize.STRING },
        activated: { type: Sequelize.STRING },
        created_at: { type: Sequelize.DATE },
        offer_activated: { type: Sequelize.STRING, allowNull: true },
        waiting_time: { type: Sequelize.STRING, allowNull: true }
    }, {
        timestamps: false,
        underscored: true
    }
);

Product.hasMany(ImageProductPath);
module.exports = Product;