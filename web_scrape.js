require('dotenv').config();
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
    const page = await browser.newPage();
    await page.setBypassCSP(true);

    await page.goto("https://app.pictory.ai/login");
    await delay(3000);

    await page.type('#mui-1', pictoryLogin);
    await page.type('#outlined-adornment-password', pictoryPassword);
    await page.click('.css-1du8a1u');
    await delay(10000);
    
    await page.click('.script-to-video-button');
    await page.type('.script-video-name input', dummy_data.title );

    await page.screenshot({ path: 'example.png' });

    await browser.close();
})();
