require('dotenv').config();
const https = require('https');
const fs = require('fs');
const puppeteer = require('puppeteer');
const pictoryLogin = process.env.PICTORY_LOGIN;
const pictoryPassword = process.env.PICTORY_PASSWORD;

// todo:
// 1. time stamps for % of vid render
// 2. loops to control and shorten te time of video creation

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
        console.log(time+' passed');
    });
 }

//  chatInput:
//  napisz mi scnariusz do nowego ktortkirgo filmiku motywacyjnego na yt. 

//  Scenariusz MUSI być w formie:
//  Pirwsza linia - tytuł
//  Każda kolejna linia- tekst wyświetlany na konkretnej scenie
 
//  W odpowiedzi napisz mi tylko tytuł oraz tekst wyświetlany na konkretnych scenach. Bez opisu scenerii. Sam tekst który będzie wyświetlany na filmie. Nie pisz
//  Tytuł: , Scena 1: i tak dalej. Napisz sam tekst wyświetlany na filmie.
 
//  Odpowiedź zwróc w formie pliku JSON.

 dummy_data={
    "title": "Rise to Greatness",
    "scenes": [
      "Unlock Your Potential",
      "Embrace the Challenges",
      "Persist Through Adversity",
      "Dream Big, Work Hard",
      "Failure is a Stepping Stone",
      "Celebrate Your Victories",
      "Stay Focused, Stay Committed",
      "Inspire Others with Your Journey",
      "Success is a Journey, Not a Destination"
    ]
};  

(async ()=>{
    const browser = await puppeteer.launch({
        // slowMo: 100,
        headless: false,
        // args: chromium.args,
        // defaultViewport: chromium.defaultViewport,
        // executablePath: await chromium.executablePath,
        // ignoreHTTPSErrors: true,
    });

    // Opening browser
    const page = await browser.newPage();
    await page.setBypassCSP(true);

    // Opening page
    await page.goto("https://app.pictory.ai/login");
    await delay(5000);

    // Logging in
    await page.type('#mui-1', pictoryLogin);
    await page.type('#outlined-adornment-password', pictoryPassword);
    await page.click('.css-1du8a1u', );
    await delay(10000);
    
    // Declaring video making method
    await page.click('.script-to-video-button');
    await delay(5000);

    // Data insert
    // Concatenate sentences with dots between them
const concatenatedSentences = dummy_data.scenes.join('. ');

    // Use the concatenated string in your script
    await page.type('.script-video-name input', dummy_data.title);
    await page.$$eval('.ck-editor__editable p', (links, concatenatedString) => {
        links.forEach((el) => el.innerHTML = concatenatedString);
    }, concatenatedSentences);
    await delay(10000);

    // Proceed
    await page.click('.css-8aqpyn .css-1he72jf');
    await delay(50000); // 40s - time for creating video

    // Choosing Orientation
    await page.screenshot({ path: './tmp_screenshots/orientation_change.png' });
    await page.click('.css-t788js');
    await delay(2000);

    // Choosing aspect ratio
    const [screen_button] = await page.$x("//span[contains(., 'Portrait')]");
    if (screen_button) {
        await screen_button.click();
    }
    await delay(3000);

    // Closing watermark info
    const [wm_button] = await page.$x("//button[contains(., 'Got')]");
    if (wm_button) {
        await wm_button.click();
    }
    await delay(1000);

    // Expanding voiceover menu
    await page.click('#voiceover-menu-button');
    await delay(5000);
    
    // Choosing aspect ratio
    await page.click('#voiceover-menu li');
    await delay(5000);
    
    // Close popup advertisement
    await page.click('.voice-over-banner div svg');
    
    // Choosing voice model
    await page.hover('#voiceTrack3034');
    await page.focus('#voiceTrack3034');
    await page.screenshot({ path: './tmp_screenshots/hover.png' })
    await delay(5000);
    await page.click('#voiceTrack3034 .css-1g747ue .apply-box span');   // common err
    await delay(20000);

    // Change font
    await page.click('#template-styles-tab');
    await delay(2000);
    await page.click('#style_d7eb227e-ff83-4d7b-98c1-6f0e5f3156f6');

    // Increasing scene duration to 3s
    await page.hover('#scene-duration-container');
    await delay(2000);
    await page.focus('#standard-number');
    await page.keyboard.press('Backspace');
    await page.type('#standard-number', '3');
    await delay(1000);
    await page.hover('#scene-duration-container');
    await delay(2000);
    await page.click('.css-1m9pwf3');
    await delay(1000);
    await page.screenshot({ path: './tmp_screenshots/duration_change.png' });
    
    // Generate video
    await page.hover('#generate-button-dropdown a');
    await delay(5000);
    await page.screenshot({ path: './tmp_screenshots/btn_gener.png' });
    await page.click('#btnGenerate');
    await delay(60000);
    await delay(60000);
    await delay(60000);
    await delay(60000);
    await page.screenshot({ path: './tmp_screenshots/post_render.png' });

    // await page.click('.css-13kkobs'); // this downloads movie in browser ...
    await page.click('.css-i3999f'); // show Link to download movie
    await delay(2000);

    await page.waitForSelector('.css-1dzcpmd')
    let element = await page.$('.css-1dzcpmd')
    let value = await page.evaluate(el => el.textContent, element)

    await page.goto(value);
    await delay(5000);

    let src = await page.$eval("video", n => n.getAttribute("src"))
    console.log(src);

    await page.screenshot({ path: './tmp_screenshots/video_download.png' });

    const file = fs.createWriteStream("./videos/video.mp4");
    const request = https.get(src, function(response) {
        response.pipe(file);

        // after download completed close filestream
        file.on("finish", () => {
        file.close();
        console.log("Download Completed");
        });
    });

    await browser.close();
})();
