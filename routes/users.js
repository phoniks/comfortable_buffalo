import express from 'express'
const router = express.Router()

/* GET users listing. */
router.get('/', ( req, res ) => {
  const { user } = req
  res.render('profile', { user })
})

module.exports = router
