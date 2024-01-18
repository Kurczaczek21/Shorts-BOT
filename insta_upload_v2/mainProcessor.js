const { uploadVideo, getStatusCode, publishVideo } = require('./insta_upload.js');

async function processVideo(videoUrl, caption, accessToken, igUserId) {
  try {
    const results = await uploadVideo(videoUrl, accessToken, igUserId, caption);
    console.log('Please wait, the video is uploading');
    await new Promise((resolve) => setTimeout(resolve, 15000));

    const igContainerId = results.id;

    const s = await getStatusCode(igContainerId, accessToken);

    if (s === 'FINISHED') {
      console.log('Video uploaded successfully!');
      await publishVideo(results, accessToken, igUserId);
    } else {
      console.log('Please wait a bit more...');
      await new Promise((resolve) => setTimeout(resolve, 60000));
      await publishVideo(results, accessToken, igUserId);
    }

    console.log('Processing finished');
    return "OK";
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
  processVideo,
};
