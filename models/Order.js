const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");
const sequelize = new Sequelize(db);
const Branch = require("./Branch");

const Order = sequelize.define(
    "order", {
        total: { type: Sequelize.INTEGER, allowNull: true },
        status: { type: Sequelize.STRING, allowNull: true },
        specification: { type: Sequelize.STRING, allowNull: true },
        reservation: { type: Sequelize.STRING, allowNull: true },
        user_id: { type: Sequelize.INTEGER, allowNull: true },
        payment_method: { type: Sequelize.STRING, allowNull: true },
        payed: { type: Sequelize.STRING, allowNull: true },
        tables_id: { type: Sequelize.INTEGER, allowNull: true },
        branch_id: { type: Sequelize.INTEGER, allowNull: true },
        transaction_id: { type: Sequelize.STRING, allowNull: true },
    }, {

        underscored: true
    }
);

Order.belongsTo(Branch);
module.exports = Order;