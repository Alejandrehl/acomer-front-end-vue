const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");
const sequelize = new Sequelize(db);

const User = sequelize.define(
  "user",
  {
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    encrypted_password: { type: Sequelize.STRING, allowNull: false },
    created_at: { type: Sequelize.DATE, defaultValue: Date.now },
    updated_at: { type: Sequelize.DATE, defaultValue: Date.now },
    name: { type: Sequelize.STRING, allowNull: false },
    last_name: { type: Sequelize.STRING, allowNull: true },
    phone: { type: Sequelize.STRING, allowNull: true },
    rut: { type: Sequelize.STRING, allowNull: true },
    birthdate: { type: Sequelize.DATE, allowNull: true },
    gender: { type: Sequelize.STRING, allowNull: true },
    provider: { type: Sequelize.STRING, allowNull: true },
    uid: { type: Sequelize.STRING, allowNull: true },
    image: { type: Sequelize.STRING, allowNull: true },
    biography: { type: Sequelize.TEXT, allowNull: true },
    linkedin: { type: Sequelize.STRING, allowNull: true },
    twitter: { type: Sequelize.STRING, allowNull: true },
    web: { type: Sequelize.STRING, allowNull: true },
    instagram: { type: Sequelize.STRING, allowNull: true },
    exp: { type: Sequelize.STRING, allowNull: true },
    admin: { type: Sequelize.BOOLEAN, allowNull: true },
    branch_number: { type: Sequelize.INTEGER, allowNull: true }
  },
  {
    timestamps: false
  }
);

module.exports = User;
