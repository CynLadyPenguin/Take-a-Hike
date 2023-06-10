# TrailFeathers

Trail Feathers is an app for hiking and bird watching anywhere in the world! Use it to explore hiking and biking trails, organize lists of items to bring with you, and search for any North American bird.

# Team ACE

Product Owner:
Scrum Master: Caity Opelka
Development Team: Rodolfo Machirica, Rene Mercadel, John Dyer, Santo Lococo, Murphy Fleenor

## Application Walk Through

The idea is to have one stop shop for all your hiking needs, with a focus on Louisiana.

When a user opens the application they will be brought to the login page where they will be redirected to google to login.

Located at the top left of every page is a navigation burger menu which contains {x} options that will quickly navigate the user to various features of the application. From left to right are the ...

Quartermaster
Allows user to create packing lists with just a name of the list and a description, after which the list is displayed on the page.
User can click on a given list which will open a new view; and there, the user can add items that they want for that trip/packing list.

Trail Feathers
Trail Feathers is an app for hiking and bird watching anywhere in the world! Use it to explore hiking and biking trails, organize lists of items
to bring with you, and search for any North American bird.

Search Trails is a feature for searching by latitude and longitude for hiking trails all over the world. It utilizes an external api form rapidAPI.

Setup Photo upload - using cloudinary a user can take and upload photos on to their own profile or trail profiles.

Packing List

Birding Check List
A searchable checklist of all the bird in Louisiana (according to eBird a Cornell run Bird Data API). This includes the bird's common name, scientific name, common family name, and common scientific name. Users can check any bird they have spotted along there journey to keep along the trail.

Bird Learner 
is located inside of and at the top of the Birding Check List. It displays 3 random bird choices from the list and plays the audio of 1 of them. The user guesses which bird's song is playing. Once the correct bird is guessed, it is added to the learnedBirds table, and noted in the Biring Check List for that bird.

Ghost Stories
A feature that allows users to type in a prompt and receive a ghost story, courtesy of DaVinci 3, that they can then customize, save, and make their own.

Weather
The weather component is designed to help users plan their hikes around the weather. All of the trails from the database are loaded into the drop down list and when the user selects a trail, the weather data is loaded from the Open Meteo API. The data from Open Meteo is open-source and allows users to access unlimited amounts of weather data. The weather is displayed in two forms: the Daily display, which shows the temperature (in celcius), wind speed, wind direction, and weather code. The weather code meaning is displayed at the bottom of the weather component in a small box so the user can understand what the weather code means. Then the Extended forecast display, which shows the date, temperature, and weather for the next 14 days. If no data is available, a message 'Loading forecast data...' is displayed.

Trading Post
Are you tired of purchasing gear online, only to realize that it doesn't fit? Well, at the Trading Post, you can browse a selection of used gear being sold by other users. The website includes a maps feature that calculates the distance between the location of the post and your current location (if you choose to enable your browser's location settings).

If you're a logged-in user, you can post a new trade that showcases your highly sought-after used gear by utilizing the cloudinary widget, which allows you to add a photo to your post. Don't forget to include the desired meetup location for the trade. The search bar has an automatic address lookup function, so simply start typing your address, and it will provide suggestions. Convenience at its finest, don't you think?


## Tech

1. Cloudinary - Image hosting library
2. React-Router - Router library
3. Mysql - Database
4. Sequelize - ORM
5. React - Framework
6. Axios - http Client
7. Javascript
8. Node.js - Runtime Environment
9. Express - Server
10. Bulma - CSS Library
11. eslint - Linter
12. Webpack - Module Bundler
13. Passport/Google OAuth - Authentication
14. AWS EC2 - Deployment
15. Ebird - Bird data API
16. TrailApi - hiking trail data
17. MaterialUI - styling
18. Connect-session-sequelize - Session Storage

### database:

We have a mySQL/Sequelize database. We have all of our models located in database/models.

### server:

We have an express server. It is set up in server/index.js. All routes, with the exception of the birdSighting, BirdList routes and BirdLearner are stored in server/index.js. The bird routes are stored in server/routes.

### authentication

Our authentication is handled with oauth and passport. Our passport and google strategy setup can be found in server/middleware/auth.js. Once logged in, the user has access to the whole site.

### apis

We used 4 external apis for this project:

1. RapidAPI - Trail API - https://rapidapi.com/trailapi/api/trailapi/
   This API allows us to search for any trails in the world based on latitude and longitude. It requires an API key and registration through RapidAPI, but both are free.

2. Cloudinary API - https://cloudinary.com/documentation/image_upload_api_reference
   This api allows users to upload photos onto their profiles and on trail profiles. It requires credentials, but the entire setup is free for what we've used in this project.

3. BirdSightings API - https://documenter.getpostman.com/view/664302/S1ENwy59?version=latest
   This api allows users to search for any bird species and receive data about that specific bird. It is maintained by Cornell University and is free.

4. MapBox API - https://docs.mapbox.com/help/getting-started/access-tokens/
   This api allows users to use the various maps in the trading section. It has a large free limit for map requests so don't worry too much about this.

5. Xeno-Canto API - https://xeno-canto.org/explore/api
   This is the API to grab the bird sounds. 1 request/second limit.

6. Open-AI API - https://openai.com/blog/openai-api
   This api allows users to use the ai model which renders the ghost stories. It has a large, free limit of 150,000 tokens.

### front-end

The front-end was built using React and React Router. In App.jsx we initialize our trail data so that upon refresh of trail profile, the most recent trail data is rendered. In that same file we route our links and routes for the app.

The HashRouter can be found in client/index.jsx

The styling is found in login.css and main.css.

There is some inline styling found in the Trading Section.

Dev Setup:

## Environment Variables Needed

(for oauth)

1. GOOGLE_CLIENT_ID=
2. GOOGLE_CLIENT_SECRET=

(for photo upload) 3. CLOUDINARY_URL= 4. CLOUDINARY_NAME= 5. CLOUDINARY_API_KEY= 6. CLOUDINARY_API_SECRET= 7. CLOUDINARY_UPLOAD_PRESET=

(for hiking trail data) 8. X-RapidApi Key= 9. X-RapidAPI-Host=

10. (for session secret key) SESSION_ID_COOKIE=

11 (for mapBox rendering) MAPBOX_API_KEY=

12. (for openai ghost stories) OPENAI_API_KEY=

## Google OAuth

Google Oauth requires a google cloud account. First create your account and then navigate to the developer console. Go to google API and create a clientID and clientSecret. This goes inside the .env file.

## Session ID Cookie

It can be any string of your choice; it's for security purposes.

## Cloudinary

The upload preset needs to be made to handle client-side requests. You want the mode to be unsigned and access mode to be public.

## Installation/Start-up

1. First fork the repo and clone it to your local machine.
2. Collect all env keys
3. Run 'npm install' to install all dependencies
4. Open mysql, create and use a database called 'TakeAHike'
5. Run 'npm run dev' to start Webpack
6. Run 'npm start' to run the server

### Known Bugs

If you input a non-land based coordinate when searching for trails, it will return an error.
