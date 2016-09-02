import database, { Genre } from '../database'
import express from 'express'
import { loggedIn } from '../config/check-user'
const router = express.Router()

router.get('/:id', ( req, res ) => {
  const { id } = req.params
  const { user } = req

  Promise.all([ Genre.findOne(id), Genre.getBooks(id) ])
    .then(results => {
      const [ genre, books ] = results
      res.render('genre_details', { genre, books, genre_id: id, user })
    })
})

router.get('/edit/:id', loggedIn, ( req, res ) => {
  const { id } = req.params
  Genre.findOne(id).then(genre => {
    res.render('edit_genre', { genre, id })
  })
})

router.post('/edit_genre/:id', loggedIn, ( req, res ) => {
  const { id } = req.params
  Genre.update(parseInt(id), req.body).then( genre_id => {
    res.redirect( `/genres/${id}` )
  })
})

export default router
