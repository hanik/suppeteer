const express = require('express')
const store = require('../tools/store-helper')
const puppethelper = require('../tools/puppet-helper')
const router = express.Router();

let currentPage
// TODO need kinkof id for multi request
router.post('/open', (req, res, next) => {
  const data = req.body
  const url = data.url
  const auth = data.auth
  if(url) store.update('current', 'url', url)

  return (async () => {
    const page = await puppethelper.getPage(url, null, auth)
    currentPage = page
    
    if(data.guidance) {
      let guide = data.guidance     
      await puppethelper.setGuidance (page, guide)

      res.send(`open ${url}`)
      res.end()
    }
  })()
})

router.post('/setsteps', (req, res, next) => {
  const data = req.body
  const url = data.url
  const steps = data.steps

  if(url) store.update ('current', 'url', url)
  if(steps) store.update ('current', 'steps', steps)
  store.update ('current', 'stepCount', 0)
  
  res.send(`set ${steps.length} steps`)
  res.end()
})

router.post('/runstep', (req, res, next) => {
  const current = store.get('current')
  console.log(current.id)
  console.log(current.auth)
  console.log(current.url)

  res.end()
})

router.post('/getsteps', (req, res, next) => {
  const steps = store.get('current')
  console.log(store.get('current'))
  if(steps) {
    res.send(JSON.stringify(steps))
  } else {
    res.send(`There is no steps`)
  }
  res.end()
})

module.exports = router;
