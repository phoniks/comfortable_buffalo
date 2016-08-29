import express from 'express'
const router = express.Router()

router.get('/login', (req, res, next) => {
  res.render('login', {})
})

router.get('/signup', (req, res, next) => {
  res.render('signup', {})
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router
