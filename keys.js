console.log('this is loaded')

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
