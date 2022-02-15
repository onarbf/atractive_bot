require('dotenv').config();

var fs = require('fs');
var request = require('request');


const Instagram = require('instagram-web-api');
const FileCookieStore = require('tough-cookie-filestore2');

const cookieStore = new FileCookieStore('./cookies.json');
const { instagramUsername, instagramPassword } = process.env;

const instagramLogin = async ()=>{
  const client = new Instagram({ username: instagramUsername, password: instagramPassword, cookieStore });
  await client.login();

  return client;
}

const getInstagramFeedByUsername = async (client) =>{
  try {
    console.log('working');
    return await client.getPhotosByUsername({ username: 'atractive_smithers' });
  } catch (e) {
    console.log('not working');
    throw e;
  }
}

const downloadInstagramImage = (uri, filename, callback)=>{
  request.head(uri, (err, res, body)=>{
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(`./temp/${filename}`)).on('close', callback);
  });
};

const removeImageFromServer = async (filename)=>{ fs.unlinkSync(`./temp/${filename}`)}

module.exports = {
  instagramLogin,
  getInstagramFeedByUsername,
  downloadInstagramImage,
  removeImageFromServer
}
