var twitterKeys = require('./keys.js');
var spotKeys = require('./spotKeys.js');

var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var fs = require('fs');

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
var params = [];
var nodeArgs = process.argv;
// All other arguments are used as a search string

GetParams();
CommandSwitch(params[0], params[1]);

function GetParams(){
    var nodeArgs = process.argv;
    
    params.push(nodeArgs[2]);
    // All other arguments are used as a search string 
    if(nodeArgs.length > 3)
    {
        var searchString = "";
        for (let i = 3; i < nodeArgs.length; i++)
        {
            searchString += nodeArgs[i] + " ";
        }
        params.push(searchString);
    }

}

// Use the command to determine which case to run
function CommandSwitch(action, params) {
    switch (action) {
        case '-tweet':
            DisplayTweets();
            break;
    
        case `-spot`:
            DisplaySong(params);
            break;
    
        case `-movie`:
            DisplayMovie(params);
            break;
        
        case `-do`:
            FollowInstructions();
            break;
    
        default:
            console.log(action + " is not a recognized option. Please use: '-tweet', `-spot`,  `-movie`, or `-do`");
            break;
    }   
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

function DisplaySong(trackName) {

    if(typeof trackName == "undefined")
    {
        console.log("Please Enter a Track Name");
        return;
    }

    console.log ("Displaying track information for: " + trackName);
    // trackName =  '"We didnt start the fire"';

    spotify.search({ type: 'track', query: trackName, limit: 1}, function(error, data) {
        if (error) {
          return console.log('Error occurred: ' + error);
        }
        
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Track Name: " + data.tracks.items[0].name);
        console.log("Preview: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name);

        // console.log(data);
    });
}

function DisplayMovie(movieName) {

    if(typeof movieName == "undefined")
    {
        console.log("Please Enter a Movie Name");
        return;
    }

    console.log ("Displaying movie information for: " + movieName);
    
    var movie = encodeURI(movieName);
    var movieUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";

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

    fs.readFile("./random.txt", 'utf8', function (derp,  data) {
        if(derp)
            throw derp;

        var textCommand = data.split(',');
        console.log("New input arguments: ", textCommand);

        var newCommand = textCommand[0];
        var newParams = textCommand[1];
        CommandSwitch(newCommand, newParams);
    });
}

