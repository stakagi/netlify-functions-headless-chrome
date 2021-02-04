const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

exports.handler = async (event, context) => {
  console.log('spawning chrome headless')
  try {
    const executablePath = await chromium.executablePath

    // setup
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: executablePath,
      headless: chromium.headless,
    });

    // Do stuff with headless chrome
    const page = await browser.newPage();
    
    await page.goto('https://kuvo.com/playlist/218650');
    const title = await page.evaluate(() => document.querySelector('.tracklist-area .row .title').textContent.trim());
    const artist = await page.evaluate(() => document.querySelector('.tracklist-area .row .artist').textContent.trim());
    console.log(`title:${title}, artist:${artist}`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        title: title,
        artist: artist
      })
    };

  } catch (error) {
    console.log('error', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error
      })
    }
  } finally {
    // close browser
    if (browser !== null) {
      await browser.close()
    }
  }
}
