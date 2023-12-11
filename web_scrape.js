require('dotenv').config();
const https = require('https');
const fs = require('fs');
const puppeteer = require('puppeteer');
const pictoryLogin = process.env.PICTORY_LOGIN;
const pictoryPassword = process.env.PICTORY_PASSWORD;

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
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
        slowMo: 100,
        // headless: false,
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
    await page.type('.script-video-name input', dummy_data.title );
    await page.$$eval('.ck-editor__editable p', (links, value) => links.forEach(el => el.innerHTML = value), 'Unlock Your Potential. Embrace the Challenges. Persist Through Adversity. Dream Big, Work Hard. Failure is a Stepping Stone. Celebrate Your Victories. Stay Focused, Stay Committed. Inspire Others with Your Journey. Success is a Journey, Not a Destination');
    await delay(10000);

    // Proceed
    await page.click('.css-8aqpyn .css-1he72jf');
    await delay(5000);

    // Choosing Theme
    await page.click('#template_1d550871-3707-4503-9e4b-367dd849bfc7');
    await delay(5000);

    // Choosing aspect ratio
    await page.click('.css-1x97c6v .css-1lekzkb .css-79elbk');
    await delay(25000);

    // Expanding voiceover menu
    await page.click('#voiceover-menu-button');
    await delay(5000);
    
    // Choosing aspect ratio
    await page.click('#voiceover-menu li');
    await delay(5000);
    
    // Close popup advertisement
    await page.click('.voice-over-banner div svg');
    
    // Choosing voice model
    await page.hover('#voiceTrack1009');
    await page.screenshot({ path: 'hover.png' })
    await page.click('#voiceTrack1009 .css-1g747ue .apply-box span');
    await delay(10000);
    
    // Generate video
    await page.hover('#generate-button-dropdown a');
    await page.click('#btnGenerate');
    await delay(60000);
    await delay(60000);
    await delay(30000);
    await page.screenshot({ path: 'post_render.png' });
    await page.click('.css-13kkobs');

    await delay(20000);
    console.log(page.url());
    await page.screenshot({ path: 'video.png' });

    const file = fs.createWriteStream("video.mp4");
    const request = https.get(page.url(), function(response) {
        response.pipe(file);

        // after download completed close filestream
        file.on("finish", () => {
        file.close();
        console.log("Download Completed");
        });
    });


    await page.screenshot({ path: 'example.png' });

    await browser.close();
})();
