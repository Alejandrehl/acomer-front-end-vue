const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");
const sequelize = new Sequelize(db);

const Table = sequelize.define(
  "tables",
  {
    description: { type: Sequelize.STRING, allowNull: true },
    state: { type: Sequelize.STRING, allowNull: true },
    branch_id: { type: Sequelize.STRING, allowNull: true },
    number: { type: Sequelize.INTEGER, allowNull: true }
  },
  {
    timestamps: false
  }
);

// Branch.hasMany(ImagePath);
module.exports = Table;
