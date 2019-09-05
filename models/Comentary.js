const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");
const sequelize = new Sequelize(db);
const Product = require("./Product");

const Comentary = sequelize.define(
  "reviews",
  {
    stars: { type: Sequelize.STRING, allowNull: false },
    commentary: { type: Sequelize.TEXT, allowNull: false },
    user_name: { type: Sequelize.STRING, allowNull: false },
    created_at: { type: Sequelize.DATE, defaultValue: Date.now },
    updated_at: { type: Sequelize.DATE, defaultValue: Date.now },
    product_id: { type: Sequelize.INTEGER, allowNull: false }
  },
  {
    timestamps: false,
    underscored: true
  }
);

// Category.belongsTo(User)

Comentary.belongsTo(Product);
module.exports = Comentary;
