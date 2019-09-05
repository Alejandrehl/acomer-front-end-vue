const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");
const sequelize = new Sequelize(db);

const ImageProductPath = sequelize.define(
  "image_product_paths",
  {
    url: { type: Sequelize.TEXT, allowNull: false },
    created_at: { type: Sequelize.DATE, defaultValue: Date.now },
    updated_at: { type: Sequelize.DATE, defaultValue: Date.now }
  },
  {
    timestamps: false,
    underscored: true
  }
);

module.exports = ImageProductPath;
