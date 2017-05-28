import 'babel-polyfill'
// Importing modules
import request from 'request-promise'
import {encodeInBase64} from './utils/encodeInBase64'
// Loading configuration
import dotenv from 'dotenv'
dotenv.config()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const AUTH_CODE = process.env.AUTH_CODE

// Get user Authentication code
const getAuthorizationCode = () => {
  if (!AUTH_CODE) {
    const url = `https://accounts.spotify.com/authorize/?client_id=${CLIENT_ID}&response_type=code&redirect_uri=http://www.webiste.com/&scope=user-read-private%20user-read-email%20user-library-modify`
    console.log(`Please go to this link and insert your code\n\n${url}\n\n`)
    process.exit()
  }

  return AUTH_CODE
}

// Authentication
const getAuthToken = async(code, redirect_uri) => {
  const options = {
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      Authorization: 'Basic ' + encodeInBase64(`${CLIENT_ID}:${CLIENT_SECRET}`)
    },
    json: true
  }

  try {
    const response = await request(options)
    const accessToken = await response.access_token

    return Promise.resolve(accessToken)
  }
  catch (error) {
    return Promise.reject(error)
  }
}

const getMyInfo = async (accessToken) => {
  try {
    const options = {
      uri: 'https://api.spotify.com/v1/me',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }

    const response = await request(options)
    return Promise.resolve(response)
  }
  catch (error) {
    return Promise.reject(error)
  }
}

// Search for a track
const findTrack = async (trackName) => {
  try {
    const query = encodeURIComponent(trackName)
    const type = 'track'

    const response = await request(`https://api.spotify.com/v1/search?q=${query}&type=${type}`)
    const trackId = await JSON.parse(response).tracks.items[0].id

    return Promise.resolve(trackId)
  } catch (error) {
    return Promise.reject(error)
  }
}

const addTrack = async(trackId, userToken) => {
  try {
    const options = {
      method: 'PUT',
      uri: 'https://api.spotify.com/v1/me/tracks',
      body: [trackId],
      headers: {
        Authorization: `Bearer ${userToken}`
      },
      json: true
    }

    const response = await request(options)
    return Promise.resolve(response)
  } catch (error) {
    return Promise.reject(error)
  }
}

const userCode = getAuthorizationCode()

getAuthToken(userCode, 'http://www.webiste.com/')
  .then(accessToken => {
    findTrack('Slipknot - Wait and Bleed')
      .then(trackId => {
        addTrack(trackId, accessToken)
          .then(res => console.log(res))
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
