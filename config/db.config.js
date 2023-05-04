const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  HOST: process.env.host || "localhost",
  USER: process.env.user || "root",
  //PASSWORD: process.env.AWS_DB_PASSWORD || '123456',
  PASSWORD: process.env.password || "",
  DB: "fitness",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
