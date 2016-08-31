import database, { Genre } from '../database'
import express from 'express'
const router = express.Router()

router.get('/:id', ( req, res ) => {
  const { id } = req.params
  Promise.all([ Genre.findOne(id), Genre.getBooks(id) ])
    .then(results => {
      const [ genre, books ] = results
      res.render('genre_details', { genre, books })
    })
})

export default router
