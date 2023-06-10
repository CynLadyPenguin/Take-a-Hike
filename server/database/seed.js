const mysql = require('mysql2/promise');

const createDb = () => {
  return mysql
    .createConnection({ user: 'root', password: '', host: '127.0.0.1' })
    .then((db) => {
      db.query('CREATE DATABASE IF NOT EXISTS `TakeAHike`');
      return db;
    })
    .then((db) => db.end())
    .then(() =>
      console.log(
        '\x1b[33m',
        "\nDatabase (MySQL): 'TakeAHike' successfully created!"
      )
    )
    .catch((err) => console.log(22, 'error', err));
};

const seedSqlize = () => {
  createDb().then(() => {
    const { db } = require('./index.js');
    const { Trails } = require('./models/trails.js');
    const { dummyParkData } = require('../../copyAPIparkData/dummyDataCopy.js');
    const { PackingLists } = require('./models/packingLists.js');
    const { PackingListItems } = require('./models/packingListItems.js');
    const { Users } = require('./models/users.js');
    const birdsOfLA = require('./data/eBirdData.js');
    const { BirdList } = require('./models/birdList.js');
    const { BirdSightings } = require('./models/birdSightings.js');
    const { LearnedBirds } = require("./models/learnedBirds.js");
    const { Stories } = require('./models/stories.js');

    Users.sync()
      .then(() =>
        console.log(
          '\x1b[36m',
          "\nDatabase (MySQL): 'Users' table successfully created!"
        )
      )
      .then(() => PackingLists.sync())
      .then(() =>
        console.log(
          '\x1b[36m',
          "\nDatabase (MySQL): 'PackingLists' table successfully created!"
        )
      )
      .then(() => BirdList.sync())
      .then(() =>
        console.log(
          '\x1b[36m',
          "\nDatabase (MySQL): 'BirdList' table successfully created!"
        )
      )
      .then(() => BirdSightings.sync())
      .then(() =>
        console.log(
          '\x1b[36m',
          "\nDatabase (MySQL): 'BirdSightings' table successfully created!"
        )
      )
      .then(() => LearnedBirds.sync()) // Sync the LearnedBirds table
      .then(() =>
        console.log(
          "\x1b[36m",
          "\nDatabase (MySQL): 'LearnedBirds' table successfully created!"
        )
      )
      .then(() => PackingListItems.sync())
      .then(() =>
        console.log(
          '\x1b[36m',
          "\nDatabase (MySQL): 'PackingListItems' table successfully created!"
        )
      )
      .then(() => Trails.sync())
      .then(() =>
        console.log(
          '\x1b[36m',
          "\nDatabase (MySQL): 'Trails' table successfully created!"
        )
      )
      .then(() => Stories.sync())
      .then(() =>
        console.log(
          '\x1b[36m',
          "\nDatabase (MySQL): 'Stories' table successfully created!"
        )
      )

      .then(() => Promise.all(dummyParkData.map((txn) => Trails.create(txn))))
      .then((arr) =>
        console.log(
          '\x1b[32m',
          `\nDatabase (MySQL): Successfully seeded trails with ${arr.length} entries!\n`,
          '\x1b[37m'
        )
      )
      .then(() => Promise.all(birdsOfLA.map((bird) => BirdList.create(bird))))
      .then((arr) =>
        console.log(
          '\x1b[32m',
          `\nDatabase (MySQL): Successfully seeded birdList with ${arr.length} entries!\n`,
          '\x1b[37m'
        )
      )
      .catch((err) => console.log(72, 'error', err))
      .then(process.exit);
  });
};

seedSqlize();