const axios = require('axios');

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

module.exports = {
  uploadVideo,
  getStatusCode,
  publishVideo,
};