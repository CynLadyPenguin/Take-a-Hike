// Import Dependencies
const { DataTypes } = require("sequelize");
const { db } = require("../index.js");


const Session = db.define('session', {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  expires: {
    type: DataTypes.DATE,
  },
  data: {
    type: DataTypes.TEXT,
  },
});

// Export Schema
module.exports = {
  Session,
};