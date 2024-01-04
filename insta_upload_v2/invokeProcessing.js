const { processVideo } = require('./mainProcessor.js');
require('dotenv').config();

const igUserId = process.env.IG_USER_ID;
const accessToken = process.env.ACCESS_TOKEN;
// const videoUrl = process.env.VIDEO_URL; // replace it with the actual video URL
// const caption = process.env.CAPTION; // replace it with the actual caption

// Invoke the processVideo function with the required arguments
processVideo("https://d3uryq9bhgb5qr.cloudfront.net/ProfessionalMonthlyLimitedUsePerUser/c5d1d667-c471-48f5-b75f-8fef5ca2b927/6982a29f-2847-4c7c-819a-1e5bb3436a3d/VIDEO/EmbraceChange.mp4", "I want you to know you are unique. <3", accessToken, igUserId);
