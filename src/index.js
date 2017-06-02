import 'babel-polyfill'
// Importing modules
import SpotifyWebApi from 'spotify-web-api-node'
import fs from 'fs'
import {join} from 'path'
// Loading configuration
import dotenv from 'dotenv'
dotenv.config()

const spotifyApi = new SpotifyWebApi({
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET,
  redirectUri : process.env.REDIRECT_URI
})

if (!process.env.AUTH_CODE) {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-modify-public',
    'playlist-modify-private'
  ]
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, null)

  console.log(authorizeURL)
  process.exit()
}

const playlistName = 'VK music'
const data = fs.readFileSync(join(__dirname, '../data/music.txt'), 'utf8')

let tracks = data.split('\n')


spotifyApi.authorizationCodeGrant(process.env.AUTH_CODE)
  .then((data) => {
    console.log(`The token expires in ${data.body['expires_in']}`)
    console.log(`The access token is ${data.body['access_token']}`)
    console.log(`The refresh token is ${data.body['refresh_token']}`)

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token'])
    spotifyApi.setRefreshToken(data.body['refresh_token'])

    // Create Playlist
    spotifyApi.createPlaylist(process.env.USERNAME, playlistName, { 'public' : true })
      .then((data) => {
        const playlistId = data.id
      }, (err) => {
        console.log('Something went wrong while creating playlist!', err)
      })

    for (var i = 0; i < tracks.length; i++) {
      spotifyApi.searchTracks(tracks[i])
        .then(data => {
          if (data.tracks && data.tracks[0]) {
            console.log(data.tracks[0].id)
          } else {
            fs.appendFileSync(join(__dirname, '../data/out.txt'), tracks[i])
          }
        })
        .catch(err => console.log(err))
    }


    //
    //   // Add tracks to a playlist
    //   spotifyApi.addTracksToPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"])
    //     .then(function(data) {
    //       console.log('Added tracks to playlist!');
    //     }, function(err) {
    //       console.log('Something went wrong!', err);
    //     });
  }, (err) => {
    console.log('Something went wrong!', err)
  })
