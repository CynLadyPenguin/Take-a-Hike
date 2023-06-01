// Import Dependencies
// const mysql = require("mysql2");
const { Sequelize } = require("sequelize");

// Initialized DB
const db = new Sequelize("TakeAHike", "root", "", {
  host: "localhost", // The `host` parameter is required for other databases
  dialect: "mysql",
  logging: false, // Avoids printing all of the syncing messages in the server console (there's a lot)
});

// Use Sequelize Authenticate Method
db.sync()  // Syncs the database and models
  .then(() => {
    console.log("Tables have been synchronized.");
    db.authenticate()
  })

  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

db.query("set foreign_key_checks = 0");

// Export DB
module.exports = {
  db,
};
