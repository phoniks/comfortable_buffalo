import express from 'express'
const router = express.Router()

router.get('/login', (req, res, next) => {
  res.render('index', { title: 'Express' })
})

module.exports = router
