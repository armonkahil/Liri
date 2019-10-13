/* eslint-disable no-sequences */
// =============================================================================
// global variables
// =============================================================================
// keys loaded
require('dotenv').config()
// axios package
var axios = require('axios')
// file system package
var fs = require('fs')
// file to keep api keys secret
var keys = require('./keys.js')
// Spotify package
var Spotify = require('node-spotify-api')
// moment package
var moment = require('moment')
// var to store proccess arguments
var inputString = process.argv
// var for command argument
var command = inputString[2]
// var for subject searched
var argument = inputString[3]
// adding keys to spotify
var spotify = new Spotify(keys.spotify)
// adding keys to bands in town
var bands = keys.bands.key
// adding keys to omdb
var goldenTicket = keys.movies.key

// =============================================================================
// app functions
// =============================================================================
// function to evaluate command variable
function ask (data1, data2) {
  switch (data1) {
    case 'concert-this':
      concert(data2)
      break
    case 'spotify-this-song':
      spotifySucks(data2)
      break
    case 'movie-this':
      // if movie subject is left blank
      if (data2 === undefined) {
        netflix('Mr.Nobody')
      } else {
        netflix(data2)
      }
      break
    case 'do-what-it-says':
      jarvis()
      break
  }
}

/* eslint no-unused-expressions: ['error', { "allowShortCircuit": true, "allowTernary": true }]  */
// concert-this function
function concert (artist) {
  // query url
  var queryUrl = 'https://rest.bandsintown.com/artists/' + artist + '/events?app_id=' + bands
  /* eslint-disable no-unused-expressions */
  // axios call
  axios.get(queryUrl).then(
    function (response) {
      // var to store formatted info for log file
      var list = '<concert-this> <' + artist + '>'
      for (var i = 0; i < response.data.length; i++) {
        var venueName = '\nVenue: ' + response.data[i].venue.name
        var where = '\nLocation: ' + response.data[i].venue.city + ', ' + response.data[i].venue.region + ' ' + response.data[i].venue.country
        var venueDate = '\nDate and Time:' + moment(response.data[i].datetime).format('MM/DD/YY hh:mm A')     
        var logged = venueName + where + venueDate
        console.log(logged)
        list += logged
      }
      // log data to log.txt file
      logger(list)
    }), function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an object that comes back with details pertaining to the error that occurred.
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
    }
    console.log(error.config)
  }
}
/* eslint-enable no-unused-vars */
// spotify function
function spotifySucks (data1) {
  spotify.search({ type: 'track', query: data1 }, function (err, response) {
    if (err) {
      console.log('Error occurred: ' + err)
      return
    }
    var list = '<spotify-this-song> <' + data1 + '>'
    var info = response.tracks.items[0]
    var artistName = '\nArtist Name: ' + info.artists[0].name
    var trackName = '\nTrack Name: ' + info.name
    var preview = '\nPreview Url: ' + info.preview_url
    var albumName = '\nAlbum Name: ' + info.album.name
    list += artistName + trackName + preview + albumName
    console.log(list)
    logger(list)
  })
}
// movie-this function
function netflix (movie) {
  var queryUrl = 'http://www.omdbapi.com/?t=' + movie + '&apikey=' + goldenTicket
  axios.get(queryUrl).then(
    function (response) {
      var list = '<movie-this> <' + movie + '>'
      var title = '\n* Title: ' + response.data.Title
      var year = '\n* Year: ' + response.data.Year
      var imdb = '\n* Imdb Rating: ' + response.data.imdbRating
      var rotten = '\n* Rotten Tomatoes: ' + response.data.Ratings[1].Value
      var country = '\n* Country: ' + response.data.Country
      var lang = '\n* Language: ' + response.data.Language
      var plot = '\n* Plot: ' + response.data.Plot
      var actor = '\n* Actors: ' + response.data.Actors
      list += title + year + imdb + rotten + country + lang + plot + actor
      console.log(list)
      logger(list)
    }), function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an object that comes back with details pertaining to the error that occurred.
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
    }
    console.log(error.config)
  }
}

// do-what-it-says function
function jarvis () {
  var list = '<do-what-it-says>'
  // log so that following info shows that do-what-it says was chosen
  logger(list)
  fs.readFile('random.txt', 'utf8', function (error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error)
    }
    // We will then print the contents of data
    console.log(data)
    // Then split it by commas (to make it more readable)
    var dataArr = data.split(',')
    // We will then re-display the content as an array for later use.
    console.log(dataArr)
    ask(dataArr[0], dataArr[1])
  })
}

// log function
function logger (data) {
  fs.appendFile('log.txt', '\n' + data, function (error) {
    if (error) {
      console.log('error')
    } else {
      console.log('data logged')
    }
  })
}

// function to handle names or titles longer than one word
function Start () {
  if (inputString.length > 4) {
    argument = inputString.slice(3, inputString.length - 1).join('')
  }
  ask(command, argument)
}
// start app
Start()
