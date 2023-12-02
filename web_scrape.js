const { fstat } = require('fs');
const puppeteer = require('puppeteer');

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

(async ()=>{
    const browser = await puppeteer.launch({
        slowMo: 100,
        headless: false
    });
    const page = await browser.newPage();

    await page.goto("https://ai.invideo.io/login");
    const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
    await page.click('.c-PJLV-ifvayZa-css');                  // click, a new tab opens
    const googleAuth = await newPagePromise;           // open new tab /window, 

    await delay(4000);
    await googleAuth.waitForSelector('.zHQkBf', { timeout: 5_000 });
    await googleAuth.type('.zHQkBf','infinity.ai.master@gmail.com', {delay: 70})
    await googleAuth.click('.VfPpkd-LgbsSe-OWXEXe-k8QpJ');
    await delay(4000);
    // await googleAuth.type('.zHQkBf','PASSWORD', {delay: 70}) // PASSWORD VISABLE
    
    await googleAuth.screenshot({ path: 'example.png' });

    await browser.close();
})();
