import database, { Book, Author, Genre } from '../database'
import express from 'express'
const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  Promise.all([ Book.all(1,4), Author.all(1,4), Genre.all(1,4)])
    .then( results => {
      const [ books, authors, genres ] = results
      res.render( 'homepage', { books, authors, genres })
    })
})

router.get('/about', (req, res, next) => {
      res.render( 'about')
    })

export default router
