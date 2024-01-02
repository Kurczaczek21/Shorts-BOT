const axios = require('axios');
require('dotenv').config();

const igUserId = process.env.IG_USER_ID;
const accessToken = process.env.ACCESS_TOKEN;
const videoUrl = process.env.VIDEO_URL;
const caption = process.env.CAPTION;

// 1 - upload video to instagram
async function uploadVideo(videoUrl, accessToken, igUserId, caption) {
  const postUrl = `https://graph.facebook.com/v18.0/${igUserId}/media`;
  const payload = {
    media_type: 'REELS',
    video_url: videoUrl,
    caption: caption,
    access_token: accessToken,
  };

  try {
    const response = await axios.post(postUrl, payload);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    throw new Error('Error uploading video to Instagram');
  }
}

// 2 - get status_code
async function getStatusCode(igContainerId, accessToken) {
  const graphUrl = 'https://graph.facebook.com/v18.0/';
  const url = `${graphUrl}${igContainerId}`;
  const params = {
    access_token: accessToken,
    fields: 'status_code',
  };

  try {
    const response = await axios.get(url, { params });
    return response.data.status_code;
  } catch (error) {
    console.error(error.response.data);
    throw new Error('Error getting status code');
  }
}

// 3 - publish video on instagram
async function publishVideo(results, accessToken, igUserId) {
  if ('id' in results) {
    const creationId = results.id;
    const secondUrl = `https://graph.facebook.com/v18.0/${igUserId}/media_publish`;
    const secondPayload = {
      creation_id: creationId,
      access_token: accessToken,
    };

    try {
      const response = await axios.post(secondUrl, secondPayload);
      console.log(response.data);
      console.log('Video published to Instagram');
    } catch (error) {
      console.error(error.response.data);
      throw new Error('Error publishing video on Instagram');
    }
  } else {
    console.log('Video posting is not possible');
  }
}

async function main() {
  try {
    const results = await uploadVideo(videoUrl, accessToken, igUserId, caption);
    console.log('Please wait, the video is uploading');
    await new Promise((resolve) => setTimeout(resolve, 15000)); // Wait for 15 seconds for the video to upload

    const igContainerId = results.id;

    const s = await getStatusCode(igContainerId, accessToken);

    if (s === 'FINISHED') {
      console.log('Video uploaded successfully!');
      await publishVideo(results, accessToken, igUserId);
    } else {
      console.log('Please wait a bit more...');
      await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait for 1 more minute
      await publishVideo(results, accessToken, igUserId);
    }

    console.log('Program finished');
  } catch (error) {
    console.error(error.message);
  }
}

main();
