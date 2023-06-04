// Import Dependencies
const axios = require('axios');
const sequelize = require('sequelize');
const { query } = require('express');
const express = require('express');
const path = require('path');
const passport = require('passport');
require('dotenv').config();

const { BirdList } = require("./database/models/birdList.js")
const { BirdSightings } = require("./database/models/birdSightings.js")
const { PackingLists } = require("./database/models/packingLists");
const { PackingListItems } = require("./database/models/packingListItems");

const router = express.Router();
const session = require('express-session');
require('./middleware/auth.js');
const { cloudinary } = require('./utils/coudinary');
const { Users } = require('./database/models/users');

// // Import session storage
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// // Import DB
const { db } = require('./database/index.js')

// // Import Routes
// const birdListRouter = require('./database/routes/birdListRouter.js')

// Set Distribution Path
const PORT = 5555;
const distPath = path.resolve(__dirname, "..", "dist"); //serves the hmtl file of the application as default on load

// Create backend API
const app = express();

///////////////////////////////////////// Use Middleware ////////////////////////////

app.use(express.json()); // handles parsing content in the req.body from post/update requests
app.use(express.static(distPath)); // Statically serves up client directory
app.use(express.urlencoded({ extended: true })); // Parses url (allows arrays and objects)

// session storage declaration
const sessionStore = new SequelizeStore({
  db: db,
  modelKey: 'sid', // sid = Session ID, stores this as the key so it's quick to grab the session data
  expiration: 24 * 60 * 60 * 1000, // Set the session expiration time to 24 hours, removes it from the database so session data stays clean
});

// defining the session options for the middleware
app.use(
  session({
    secret: [process.env.SESSION_ID_COOKIE], // needs to be in an .env file and imported
    resave: false, // does not save session if it hasn't been modified
    saveUninitialized: false, // session only saves if it has been modified
    store: sessionStore, // session is stored using the connect-session-sequelize package
  })
);
app.use(passport.initialize()); //passport is used on every call
app.use(passport.session());  //passport uses express-session


const successLoginUrl = 'http://localhost:5555/#/profile';
const errorLoginUrl = 'http://localhost:5555/login/error';

//Auth Routes
app.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureMessage: 'cannot login to Google',
    failureRedirect: errorLoginUrl,
    successRedirect: successLoginUrl
  }),
  (req, res) => {
    res.send("Hello, you.");
  }
);

app.post('/logout', function(req, res) {
  req.logout();
  res.redirect('/#/login');
});


// // Middleware to check if user is logged in on every request
const isAuthenticated = (req, res, next) => {
  if(req.user) {
    console.log('User authenticated', req.user)
    return next();
  }
  else {
    return res.status(401).send('User not authenticated');
  }
}

app.use(isAuthenticated) // using the function above in middleware

///////////////////////////////////////////////////////////////////////////


// // Import Trading Routes
const trading = require('./database/routes/tradingRouter.js');
app.use('/trading', trading);

app.get("/profile",(req, res) => {
  Users.findOne()
    .then((data) => {
      console.log('data', data);
      res.send(data).status(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

// Getting the user object on the request and sending it to the client side
app.get('/user', async (req, res) => {
  try {
    const user = req.user;
    if(user) {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});


////////////////////////////////////////EXTERNAL TRAIL API ROUTE/////////////////////////////////////////

//GET req for trail data by latitude/longitude
app.get("/api/trailslist", (req, res) => {
  axios
    .get(
      `https://trailapi-trailapi.p.rapidapi.com/trails/explore/?lat=${req.query.lat}&lon=${req.query.lon}&radius=100`,
      {
        headers: {
          "X-RapidAPI-Host": "trailapi-trailapi.p.rapidapi.com",
          "X-RapidAPI-Key":
            "a27adeb778msh22d13ed248d5359p1d95b8jsnb7239b396c5c",
        },
      }
    )
    .then((response) => {
      // console.log(response.data); - returns array of objects of trail data
      res.json(response.data);
    })
    .catch((err) => {
      console.error("ERROR: ", err);
      res.sendStatus(404);
    });
});

//////////////////////////////////////// Cloudinary routes //////////////////////////////////////

// get request to get all images (this will later be trail specific)
app.post("/api/images", async (req, res) => {
  console.log(`server index.js || LINE 70`, req.body);
  // NEED TO CHANGE ENDPOINT TO INCLUDE TRAIL SPECIFIC PARAM SO PHOTOS CAN BE UPLOADED + RENDERED PROPERLY

  // Can create new folder with upload from TrailProfile component. Need to modify get request to filter based on folder param (which will be equal to the trail name)
  const resources = await cloudinary.search
    .expression(`resource_type:image AND folder:${req.body.trailFolderName}/*`)
    .sort_by('created_at', 'desc')
    .max_results(30)
    .execute();
  // console.log(
  //   'SERVER INDEX.JS || CLOUDINARY GET || LINE 38 || resources ==>',
  //   resources
  // ;
  // try to filter before map
  const secureImageUrls = resources.resources
    .filter((imageObj) => imageObj.folder === req.body.trailFolderName)
    .map((image) => image.secure_url);
  res.json(secureImageUrls);
});

/**
 * Routes for packing list
 */
app.post("/api/packingLists", (req, res) => {
  console.log(req.body, "Server index.js LINE 55");
  PackingLists.create({
    listName: req.body.listName,
    packingListDescription: req.body.packingListDescription,
  })
    .then((data) => {
      console.log("LINE 63", data.dataValues);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err, "Something went wrong");
      res.sendStatus(500);
    });
});
/**
 * Routes for packing list GET ALL LISTS
 */
app.get("/api/packingLists", (req, res) => {
  console.log("Server index.js LINE 166", req.body);
  PackingLists.findAll()
    .then((data) => {
      console.log("LINE 169", data);
      res.status(200).send(data);
    })
    .catch((err) => {
      console.error(err, "Something went wrong");
      res.sendStatus(404);
    });
});

/**
 * post request to the packingListItems
 */
app.post('/api/packingListItems', (req, res) => {
  console.log(
    'Is this being reached? LINE 103 SERVER.index.js || REQ.BODY \n',
    req.body
  );
  PackingListItems.create(listItem)
    .then((data) => {
      console.log('from lINE 106 INDEX.js || DATA \n', data);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Failed to create FROM 113', err);
      res.sendStatus(500);
    });
});

///////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////Bird Sightings

//////////////////////////////////////////////////////////////Bird List Routes


//GET req for all birdList data
app.get("/api/birdList/", (req, res) => {
  BirdList.findAll()
    .then((birds) => {
      res.json(birds);
    })
    .catch((err) => {
      console.error("ERROR: ", err);
      res.sendStatus(404);
    });
});

//GET req for all select birdList data
app.get('/api/birdList/birdSearch', (req, res) => {
  BirdList.findAll({
    where: {
      scientificName: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('scientificName')),
        'LIKE',
        '%' + req.query.search.toLowerCase() + '%'
      ),
    },
  })
    .then((birds) => {
      res.json(birds);
    })
    .catch((err) => {
      console.error("ERROR: ", err);
      res.sendStatus(404);
    });
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////Bird Sightings Routes 

//GET req for all birdSightings data
app.get('/api/birdsightings', (req, res) => {
  BirdSightings.findAll()
    .then((birdSightings) => {
      res.json(birdSightings);
    })
    .catch((err) => {
      console.error('ERROR: ', err);
      res.sendStatus(404);
    });
});

//POST req to birdSightings database
app.post('/api/birdsightings', (req, res) => {
  // console.log('Line 231 - Back End Bird Sightings Post Request: ', req.body);
  BirdSightings.create({
    bird_id: req.body.bird_id,
    user_id: req.body.user_id,
  })
    .then((data) => {
      console.log('LINE 220', data);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err, 'Something went wrong');
      res.sendStatus(500);
    });
});

//Delete req to birdSightings database
app.delete('/api/birdsightings', (req, res) => {
  // console.log('Line 231 - Back End Bird Sightings Delete Request: ', req.body);
  BirdSightings.delete({
    bird_id: req.body.bird_id,
    user_id: req.body.user_id,
  })
    .then((data) => {
      console.log('LINE 220', data);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err, 'Something went wrong');
      res.sendStatus(500);
    });
});

// launches the server from localhost on port 5555
app.listen(PORT, () => {
  console.log(`
  Listening at: http://localhost:${PORT}
  `);
});
