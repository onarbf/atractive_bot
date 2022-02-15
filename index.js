const cron = require('node-cron');

const express = require ('express');
const server = express();


const {instagramLogin, getInstagramFeedByUsername, downloadInstagramImage, removeImageFromServer} = require('./helpers/instagram.js');
const {twitterLogin, createTweetWithImage} = require('./helpers/twitter.js');

const {uploadImage} = require('./helpers/cloudinary.js');

var mainImageId = undefined;
//cron job. Limited to run 200 times per hour
cron.schedule('* * * * *',async function() {

  main(mainImageId);
});

server.get("/",(req,res)=>{
  res.send("baba gube 2022")
})

const main = async (oldImageId)=>{

  //Login on API's
  const instagramClient = await instagramLogin();
  const twitterClient = await twitterLogin();

  //Getting the complete instagram feed
  const response = await getInstagramFeedByUsername(instagramClient);

  //Getting the last URL image
  const imageUrl = response.user.edge_owner_to_timeline_media.edges[0].node.display_url;
  //Getting the last URL ID
  const newImageId = response.user.edge_owner_to_timeline_media.edges[0].node.id;

  console.log("oldImageId", oldImageId );
  console.log("newImageId", newImageId );

  //if image ID's are diferent, run and work the process.
  if (oldImageId !== newImageId) {
    //temporary choosing the filename. In the future will be diferent.
    const filename = "imageToDelete.jpg"

    //downloading image from that url
    downloadInstagramImage(imageUrl,filename,async ()=>{
      console.log('ok');
      //uploading the image to Cloudinary
      const cloudinaryResponse = await uploadImage(imageUrl);
      //creating tweet with that image
      console.log('everything is working');
      await createTweetWithImage(twitterClient,"",filename);
      await removeImageFromServer(filename);
      mainImageId = newImageId;
    });


  }
}


server.listen(3000, ()=>{
  console.log('server running');
})
