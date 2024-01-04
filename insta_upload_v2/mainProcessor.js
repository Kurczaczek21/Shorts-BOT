const { uploadVideo, getStatusCode, publishVideo } = require('./insta_upload.js'); // Replace 'yourFileName' with the actual name of your file

async function processVideo(videoUrl, caption, accessToken, igUserId) {
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

    console.log('Processing finished');
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
  processVideo,
};
