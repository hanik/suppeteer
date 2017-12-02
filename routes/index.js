var express = require('express');
const puppethelper = require('../tools/puppet-helper')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Huppeteer' }) ;
});

let host = 'http://localhost:10808'
router.post('/', (req, res, next) => {
  console.log('baund-dog post method')
  if (!req.body) return res.sendStatus(400)

  const data = req.body
  console.log(req.headers.host) 
  host = req.headers.host
  const url = data.url
  const steps = data.steps

  return (async () => {
      const launchoptions = {
          headless: false
      }
      const page = await puppethelper.getPage(url, launchoptions)

      await page.addStyleTag({
          path: 'injects/style.css'
      })
      await page.addScriptTag({
          path: 'injects/scripts.js', 
      })

      page.on('console', (msg) => {
          const messageparam = 'bd-message::'
          if (msg.text.indexOf(messageparam) === 0) {
              const messageText = msg.text.replace(messageparam, '')
              const json = JSON.parse(messageText)
              pubsub.publish('CLICK', json)
          }
      })

      for (let i = 0; i < data.length; i++) {
          const step = data[i]
          if (!step.entities.includes('url')) {
              console.log(`runstep  ${i}`)
              try {
                  await puppethelper.runStep(step, page)
              } catch (error) {
                  console.error(`runStep ERROR:: ${error.message}`)
              }
          }
      }

      const result = ['on-going...']
      // await puppethelper.close(page)

      return res.send(JSON.stringify(result))
  })()
})

module.exports = router;
