import database, { Genre } from '../database'
import express from 'express'
const router = express.Router()

router.get('/:id', ( req, res ) => {
  const { id } = req.params
  Promise.all([ Genre.findOne(id), Genre.getBooks(id) ])
    .then(results => {
      const [ genre, books ] = results
      res.render('genre_details', { genre, books, genre_id: id })
    })
})

router.get('/edit/:id', ( req, res ) => {
  const { id } = req.params
  Genre.findOne(id).then(genre => {
    res.render('edit_genre', { genre, id })
  })
})

router.post('/edit_genre/:id', ( req, res ) => {
  const { id } = req.params
  Genre.update(parseInt(id), req.body).then( genre_id => {
    res.redirect( `/genres/${id}` )
  })
})

export default router
