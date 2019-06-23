require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

//create query for single or multiple strings
if (process.argv.length < 2) {
  console.log(
    "Usage: 'node liri.js '<concert-this OR spotify-this-song OR movie-this OR do-what-it-says>' '<query OPTIONAL if using do-what-it-says>''"
  );
  process.exit();
}

var userQuery = process.argv[3];
if (process.argv.length > 4) {
  for (i = 4; i < process.argv.length; i++) {
    userQuery = userQuery + " " + process.argv[i];
  }
}

//CLI Command Processor
var command = process.argv[2];
switch (command) {
  case "concert-this":
    concertThis();
    break;
  case "spotify-this-song":
    spotifyThisSong();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
}

function concertThis() {
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        userQuery +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      response.data.forEach(function(element) {
        console.log("Venue Name: " + element.venue.name);
        console.log(
          "Location: " + element.venue.city + ", " + element.venue.country
        );
        console.log("Date: " + moment(element.datetime).format("LLLL"));
      });
    });
}

function spotifyThisSong() {
  if (!userQuery) {
    userQuery = "The Sign Ace of Base";
  }
  spotify.search({ type: "track", query: userQuery }).then(function(response) {
    console.log("Artist(s): " + response.tracks.items[0].artists[0].name);
    console.log("Song Name: " + response.tracks.items[0].name);
    console.log("Preview Link: " + response.tracks.items[0].preview_url);
    console.log("Album: " + response.tracks.items[0].album.name);
  });
}

function movieThis() {
  if (!userQuery) {
    userQuery = "Mr. Nobody";
  }
  axios
    .get(
      "http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy"
    )
    .then(function(response) {
      console.log("Title: " + response.data.Title);
      console.log("Year: " + response.data.Year);
      console.log("IMDB: " + response.data.imdbRating);
      if (response.data.Ratings[1]) {
        console.log(
          "Rotten Tomatoes: " + response.data.Ratings[1].Value
        );
      }
      console.log("Country: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Cast: " + response.data.Actors);
    });
}

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, response) {
    var randomQuery = response.split(",");
    userQuery = randomQuery[1];
    switch (randomQuery[0]) {
      case "concert-this":
        concertThis();
        break;
      case "spotify-this-song":
        spotifyThisSong();
        break;
      case "movie-this":
        movieThis();
        break;
    }
  });
}
