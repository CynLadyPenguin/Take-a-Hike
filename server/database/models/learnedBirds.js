// Import Dependencies
const { DataTypes } = require('sequelize');
const { db } = require('../index.js');

// Create Schema
const LearnedBirds = db.define('learnedBirds', {
  _id: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
  userId: {type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: '_id'}},
  birdId: {type: DataTypes.INTEGER, allowNull: false, references: { model: 'birdlists', key: '_id'}},
  guessedAt: {type: DataTypes.DATE, allowNull: false},
 });

 // Export Schema
 module.exports = {
  LearnedBirds,
 }