const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");
const sequelize = new Sequelize(db);
const Branch = require("./Branch");

const FeaturedBranch = sequelize.define(
  "featured_branches",
  {
    description: { type: Sequelize.TEXT, allowNull: true },
    created_at: { type: Sequelize.DATE, defaultValue: Date.now },
    updated_at: { type: Sequelize.DATE, defaultValue: Date.now }
  },
  {
    timestamps: false,
    underscored: true
  }
);

FeaturedBranch.belongsTo(Branch);

module.exports = FeaturedBranch;
