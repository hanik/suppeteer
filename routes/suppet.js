const express = require('express');
const puppethelper = require('../tools/puppet-helper')
const router = express.Router();

const token = 'huppeteer-todo-jwt'
let id = 'init'
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'suppeteer' })
})

router.post('/open', (req, res, next) => {
  const data = req.body
  if (data.token != token) {
    res.status(403).send('invalid server')
  }
  id = data.id
  const url = data.url

  return (async () => {
    const page = await puppethelper.getPage(url)
    res.send(`open ${url}`)

    if(data.guidance) {
      let guide = data.guidance     
      await page.addStyleTag({
          path: 'injects/style.css'
      })
      await page.addScriptTag({
          path: 'injects/scripts.js', 
      })

      await puppethelper.setGuidance (page, guide)

      res.end()
    }
  })()
})

router.post('/runstep', (req, res, next) => {
  
})

module.exports = router;
