const puppeteer = require('puppeteer-extra');
const chromium = require('chrome-aws-lambda');
const pluginStealth = require('puppeteer-extra-plugin-stealth')();

puppeteer.use(pluginStealth);
pluginStealth.setMaxListeners = () => {};

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

(async ()=>{
    const browser = await puppeteer.launch({
        slowMo: 100,
        // headless: false,
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.setBypassCSP(true);

    await page.goto("https://ai.invideo.io/login");
    const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
    await page.click('.c-PJLV-ifvayZa-css');                  // click, a new tab opens
    const googleAuth = await newPagePromise;           // open new tab /window, 

    await delay(4000);
    // await googleAuth.type('.zHQkBf','infinity.ai.master@gmail.com', {delay: 70})
    await googleAuth.type('#identifierId','infinity.ai.master@gmail.com', {delay: 70})

    // await googleAuth.click('.VfPpkd-LgbsSe-OWXEXe-k8QpJ');
    await googleAuth.click('#identifierNext');
    await delay(4000);
    // await googleAuth.type('.zHQkBf','PASSWORD', {delay: 70}) // PASSWORD VISABLE
    
    await googleAuth.screenshot({ path: 'example.png' });

    await browser.close();
})();
