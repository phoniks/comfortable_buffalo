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

router.get('/edit/:id/:email', ( req, res ) => {
  const { id, email } = req.params
  res.render('edit_profile', { email, id })
})

router.post('/edit_profile/:id', ( req, res ) => {
  const { id } = req.params
  User.update(parseInt(id), req.body).then( author_id => {
    res.redirect( `/users` )
  })
})

export default router
