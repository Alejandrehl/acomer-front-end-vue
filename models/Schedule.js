const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");
const sequelize = new Sequelize(db);
const Branch = require("./Branch");

const Schedule = sequelize.define(
  "schedules",
  {
    day: { type: Sequelize.STRING, allowNull: true },
    opening: { type: Sequelize.DATE, allowNull: true },
    closing: { type: Sequelize.TEXT, allowNull: true },
  },
  {
    timestamps: false,
    underscored: true
  }
);

// Schedule.belongsTo(Branch);

module.exports = Schedule;
