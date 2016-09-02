import express from 'express'
import database, { User } from '../database'

const router = express.Router()

/* GET users listing. */
router.get('/', ( req, res ) => {
  const { user } = req
  User.getBooks(user.id).then(books => {
    res.render('profile', { user, books })
  })
})

export default router
