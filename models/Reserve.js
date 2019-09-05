const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");
const sequelize = new Sequelize(db);
const Order = require("../models/Order");

const Reserve = sequelize.define(
  "reserve",
  {
    reservation_day: { type: Sequelize.STRING, allowNull: true },
    number_people: { type: Sequelize.STRING, allowNull: true },
    mode: { type: Sequelize.STRING, allowNull: true },
    user_id: { type: Sequelize.STRING, allowNull: true },
    order_id: { type: Sequelize.STRING, allowNull: true },
    reservation_hour: { type: Sequelize.TEXT, allowNull: true },
    reservation_day: { type: Sequelize.STRING, allowNull: true }
  },
  {
    timestamps: false,
    underscored: true
  }
);

Reserve.belongsTo(Order);
module.exports = Reserve;
