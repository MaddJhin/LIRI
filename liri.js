var twitterKeys = require('./keys.js');

// The first argument passed by the user is taken for the command
var command = process.argv[2];

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
}

function DisplayMovie() {
    console.log ("Displaying movie information");
}

function FollowInstructions() {
    console.log ("Doing what it says");
}

