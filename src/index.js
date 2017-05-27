import 'babel-polyfill'
// Importing modules
import request from 'request'
import {encodeInBase64} from './utils/encodeInBase64'
// Loading configuration
import dotenv from 'dotenv'
dotenv.config()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

console.log(CLIENT_ID);
console.log(encodeInBase64('test'));
//
// request({
//   method: 'POST',
//   url: 'https://accounts.spotify.com/api/token',
//   form: {
//     grant_type: 'client_credentials'
//   },
//   headers: {
//     Authorization: 'Basic ' + encodeInBase64(clientId + ':' + clientSecret)
//   },
//   json: true
// }, function (err, response, body) {
//   if (err) throw err
//
//   console.log(body);
// })
