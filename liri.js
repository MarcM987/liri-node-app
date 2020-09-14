require("dotenv").config();
const keys = require('./keys');
const request = require('request');
const inquirer = require('inquirer');
const moment = require('moment');
const Spotify = require('node-spotify-api');
const chalk = require('chalk');
var spotify = new Spotify(keys.spotify);

inquirer.prompt({
    type: 'list',
    name: 'choice',
    message: 'Please select an option: ',
    choices: ["Find about your favorite bands' concerts", "Get spotify info about songs you like", "Get info about your favorite movie", "demo"]
}).then(liri => {
    switch (true) {
        case liri.choice === "Find about your favorite bands' concerts":
            bands();
            break;

        case liri.choice === "Get spotify info about songs you like":
            spotifyMe();
            break;

        case liri.choice === "Get info about your favorite movie":
            movies();
            break;

        case liri.choice === "demo":
            demo();
            break;

        default:

    }
    
    function bands() {
        inquirer.prompt({
            type: "input",
            message: "Please enter an artist?",
            name: "nameOfArtist"
        }).then(artistSelection => {

            var url = "https://rest.bandsintown.com/artists/" + artistSelection.nameOfArtist + "/events?app_id=b2b1d13e2f579627ed525e0f00cf2713";
            console.log(url);

            request(url, (err, res, body) => {
                if (!err && res.statusCode === 200) {
                    var obj = JSON.parse(body);
                    if (body === 'undefined') {
                        console.log("Please enter a different artist.")
                    }
                    else {
                        for (let i = 0; i < obj.length; i++) {
                            var newTime = obj[i].datetime;
                            newTime = moment(newTime).format("MM/DD/YYYY");
                            console.log(`
==================================================
${obj[i].lineup} EVENT NUMBER: ${i}
==================================================
${chalk.yellow.bold(`* Name of venue: ${obj[i].venue.name}
* Location of venue: ${obj[i].venue.country}, ${obj[i].venue.city}
* Date of event: ${newTime}\n`)}`);
                        }
                    }
                }
            });
        });
    }
    
    function spotifyMe() {
        inquirer.prompt({
            type: "input",
            message: "Enter song: ",
            name: "songName"
        }).then(songSelection => {
            spotify.search({ type: 'track', query: songSelection.songName, limit: 20 }, (err, body) => {
                if (err) throw err;
                console.log(`
=========================================================
INFO REGARDING THE SONG: ${body.tracks.items[0].name}
=========================================================
${chalk.yellow.bold(`* Artist: ${body.tracks.items[0].artists[0].name}
* Name of song: ${body.tracks.items[0].name}
* To play the song click on the following link: ${chalk.green.underline(`${body.tracks.items[0].preview_url}`)}
* The song's album is called: ${body.tracks.items[0].album.name}\n`)}`);
            });
        });
    }

    function movies() {
        inquirer.prompt({
            type: "input",
            message: "Please enter the movie's name: ",
            name: "movieName"
        }).then(movieSelection => {
            var queryURL = "http://www.omdbapi.com/?t=" + movieSelection.movieName + "&y=&plot=short&apikey=trilogy";
            request(queryURL, (err, res, body) => {
                if (!err && res.statusCode === 200) {
                    var json = JSON.parse(body);
                    console.log(`
============================================
INFORMATION ABOUT: ${json.Title}
============================================
${chalk.yellow.bold(`* Year movie came out is: ${json.Year}
* IMDB movie rating: ${json.imdbRating} 
* Country of production: ${json.Country}
* Movie plot: ${json.Plot}
* Movie Actors: ${json.Actors}\n`)}`);
                }
            });
        });

    }
   
    function demo() {
        spotify.search({ type: 'track', query: 'All the Small Things', limit: 20 }, (err, body) => {
            if (err) throw err;
            console.log("The title of the movie is : " + err);
            console.log(body);
            console.log(`Artist: `);
            console.log(`Name of song: `);
            console.log(`To play the song click on the following link: `);
            console.log(`The song's album is `);
        });
    }

});