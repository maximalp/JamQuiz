// const Spotify = require("node-spotify-api");
const SpotifyWebApi = require('spotify-web-api-node');
const request = require("request");
const bodyParser = require('body-parser');
const spotifyConfig = require('./keys.js');

module.exports = function(app) {

  // get request onto songs address to get song info from Spotify API
  app.get("/songs/:playList", function(req, res)
  {

    //choosing playlist based on params
    let playList = req.params.playList;
    let playListID;

      if (playList === "indie") {
        playListID = spotifyConfig.playlistIdIndie;
      }
      else if (playList === "pop"){
        playListID = spotifyConfig.playlistIdPop;
      }
      else {
        res.send("Invalid Playlist.");
        return;
      }


    // Create the api object with the credentials
    var spotifyApi = new SpotifyWebApi({
      clientId : spotifyConfig.clientId,
      clientSecret : spotifyConfig.clientSecret
    });

    // Retrieve an access token.
    spotifyApi.clientCredentialsGrant()
      .then(function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token'] + "\n");

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);

        //Getting info from Max playlists
        spotifyApi.getPlaylist('mellowwillow', playListID)
        .then(function(data) {

          let songData = [];
          let items = data.body.tracks.items;

          for (let i=0; i < items.length; i++)
            {
              console.log(JSON.stringify(items[i])); //Showing full JSON for Spotify API song

              console.log("Artist Name: " + items[i].track.artists[0].name + "\n");
              console.log("Song Name: " + items[i].track.name + "\n");
              console.log("Preview URL: " + items[i].track.preview_url + "\n");
              console.log("------------------------------------------" + "\n");

              let previewUrl = items[i].track.preview_url;

              if (previewUrl !== null)
                {
                  songData.push({
                    "artist": items[i].track.artists[0].name,
                    "songTitle": items[i].track.name,
                    "previewUrl": items[i].track.preview_url,
                    "albumName": items[i].track.album.name,
                    "year": items[i].track.album.release_date
                  });
                };
              }; //end for loop

          //console.log('Some information about this playlist', data.body);
          res.json(songData);

          }), (function(err) {
            console.log('Something went wrong!', err);
            res.send("error");
          });




      }, function(err) {
            console.log('Something went wrong when retrieving an access token', err);
      });

    }); // end of "/song" get call


}; // main app function ends
