var twitterKeys = require('./keys.js');
var spotKeys = require('./spotKeys.js');

var request = require('request');
var Spotify = require('node-spotify-api');

var spotify = new Spotify({
    id: spotKeys.id,
    secret: spotKeys.secret
});

// The first argument passed by the user is taken for the command
var command = process.argv[2];

// All other arguments are used as a search string
var searchString = "";
if(process.argv.length > 3)
{
    for (let i = 3; i < process.argv.length; i++)
    {
        searchString += process.argv[i] + " ";
    }
}

// Use the command to determine which case to run
switch (command) {
    case 'my-tweets':
        DisplayTweets();
        break;

    case `spotify-this-song`:
        DisplaySong();
        break;

    case `movie-this`:
        DisplayMovie();
        break;
    
    case `do-what-it-says`:
        FollowInstructions();
        break;

    default:
        console.log(command + " is not a recognized option. Please use: 'my-tweets', `spotify-this-song`,  `movie-this`, or `do-what-it-says`");
        break;
}

function DisplayTweets() {
    console.log ("Showing last 20 tweets");
}

function DisplaySong() {
    console.log ("Displaying song information");

    var songName = "";
    if(process.argv.length > 3)
        songName = '"'+searchString +'"';
    else
        console.log("Please put a track name");

    spotify.search({ type: 'track', query: songName}, function(error, data) {
        if (error) {
          return console.log('Error occurred: ' + error);
        }
       
      console.log(data.tracks); 
      });
}

function DisplayMovie() {
    console.log ("Displaying movie information");
    
    var movieName = "";
    if(process.argv.length > 3)
        movieName = encodeURI(searchString);
    else{
        console.log("You didn't put a movie. Showing Mr. Nobody");
        movieName = encodeURI('Mr. Nobody');
    }

    var movieUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

    request(movieUrl, function(error, response, body) {

        if(error)
            throw error;

        console.log("Movie Title: " + JSON.parse(body).Title);
        console.log("Release Year: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
        console.log("Country of Origin: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);

    });
}

function FollowInstructions() {
    console.log ("Doing what it says");
}

