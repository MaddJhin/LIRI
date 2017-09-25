var twitterKeys = require('./keys.js');
var spotKeys = require('./spotKeys.js');

var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var spotify = new Spotify({
    id: spotKeys.id,
    secret: spotKeys.secret
});

var twitter = new Twitter({
    consumer_key: twitterKeys.consumer_key,
    consumer_secret: twitterKeys.consumer_secret,
    access_token_key: twitterKeys.access_token_key,
    access_token_secret: twitterKeys.access_token_secret
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
    case '-tweet':
        DisplayTweets();
        break;

    case `-spot`:
        DisplaySong();
        break;

    case `-movie`:
        DisplayMovie();
        break;
    
    case `-do`:
        FollowInstructions();
        break;

    default:
        console.log(command + " is not a recognized option. Please use: '-tweet', `-spot`,  `-movie`, or `-do`");
        break;
}

function DisplayTweets() {
    console.log ("Showing last 20 tweets");

    twitter.get('statuses/user_timeline', {screen_name: 'DefPandaPenguin', count: 20}, function(error, tweets, response){
        if (error)
            console.log(error);

        tweets.forEach(function(element, i) {
            console.log("Tweet #" + (i+1) + " Date: "+ element.created_at);
            console.log("Text: "+ element.text);
        }, this);
    });
}

function DisplaySong() {
    console.log ("Displaying song information");

    var songName = "";
    if(process.argv.length > 3)
        songName = encodeURI(searchString);
    else {
        console.log("Please put a track name");
        return;
    }
    // songName =  encodeURI("We didn't start the fire");

    spotify.search({ type: 'track', query: songName, limit: 1}, function(error, data) {
        if (error) {
          return console.log('Error occurred: ' + error);
        }
       
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Track Name: " + data.tracks.items[0].name);
        console.log("Preview: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name);
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

