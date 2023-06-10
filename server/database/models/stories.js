const { DataTypes } = require("sequelize");
const { db } = require("../index.js");
const { Users } = require('./users.js');

const Stories = db.define('stories', {
  _id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  story: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    foreignKey: true,
    references: { model: 'users', key: '_id' }  // One to many relationship with Users : Stories
  },
});

const saveStory = async (title, story, user_id) => {
  const newStory = await Stories.create({
    title,
    story,
    user_id
  });
  await newStory.save();
}

module.exports = {
  Stories,
  saveStory,
};