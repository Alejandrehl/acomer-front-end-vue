const Sequelize = require("sequelize");
const config = require("config");
const db = config.get("PostgresURI");

const connectDB = async () => {
  try {
    await new Sequelize(db).authenticate();
    console.log("Base de datos conectada correctamente.");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
