const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");
const sequelize = new Sequelize(db);
const ImagePath = require("../models/ImagePath");
const Schedule = require("../models/Schedule");

const Branch = sequelize.define(
    "branches", {
        name: { type: Sequelize.STRING, allowNull: true },
        street: { type: Sequelize.STRING, allowNull: false },
        email_manager: { type: Sequelize.STRING, allowNull: false },
        telephone_manager: { type: Sequelize.STRING, allowNull: false },
        information: { type: Sequelize.TEXT, allowNull: false },
        hour_op: { type: Sequelize.STRING, allowNull: false },
        hour_cl: { type: Sequelize.STRING, allowNull: false },
        instagram_id: { type: Sequelize.STRING, allowNull: false },
        instagram_api_token: { type: Sequelize.STRING, allowNull: false },
        created_at: { type: Sequelize.DATE, defaultValue: Date.now },
        updated_at: { type: Sequelize.DATE, defaultValue: Date.now },
        branch_category: { type: Sequelize.TEXT, allowNull: false },
        by_tables: { type: Sequelize.STRING, allowNull: false },
        step: { type: Sequelize.STRING, allowNull: false },
        lat: { type: Sequelize.STRING, allowNull: false },
        leng: { type: Sequelize.STRING, allowNull: false },
    }, {
        timestamps: false
    }
);

Branch.hasMany(ImagePath);
Branch.hasMany(Schedule);
module.exports = Branch;