const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");
const sequelize = new Sequelize(db);

const ImagePath = sequelize.define(
  "image_paths",
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

module.exports = ImagePath;
