// Dependencies
const express = require("express"); // Express web server framework
const bodyParser = require("body-parser");
const path = require("path");
const request = require('request');

const cookieParser = require('cookie-parser');
const querystring = require('querystring');
//var spotify = require("node-spotify-api");
const SpotifyWebApi = require('spotify-web-api-node');

// Sets up Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
// parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('app/public'))

// requiring route pages to express
require('./router/apiroutes.js')(app);

// LISTENER
// launch express server and test
app.listen(PORT, function(){
  console.log("\n" + "App listening on port: " + PORT + "\n");
});






/**
 * This is an example of a basic node.js script that performs
 * the Implicit Grant oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#implicit_grant_flow
 */
