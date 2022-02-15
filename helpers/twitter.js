require('dotenv').config()
const {TwitterApi} = require('twitter-api-v2');
const {appKey, appSecret, accessToken, accessSecret} = process.env;

const twitterLogin = async ()=>{
  const client = new TwitterApi({ appKey, appSecret, accessToken, accessSecret });

  console.log('twitter logged');
  return client;
}

const createTweetWithImage = async (client,text,filename) => {
  try {
    const mediaIds = await Promise.all([
      client.v1.uploadMedia(`./temp/${filename}`)
    ]);

    await client.v1.tweet(text,{ media_ids: mediaIds })
  } catch (e) {
    throw e;
  }
}

module.exports = {
  twitterLogin,
  createTweetWithImage
}
