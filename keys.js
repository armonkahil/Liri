// gradient string package
const gradient = require('gradient-string')
console.log(gradient.vice('\nthis is loaded\n'))

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
}

exports.bands = {
  key: process.env.BANDS_KEY
}

exports.movies = {
  key: process.env.OMDB_KEY
}
