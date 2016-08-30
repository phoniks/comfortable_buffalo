import database, { Book, Author, Genre } from '../database'
import express from 'express'
const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  Promise.all([ Book.all(), Author.all(), Genre.all()])
    .then( results => {
      const books = results[ 0 ]
      const authors = results[ 1 ]
      const genres = results[ 2 ]

      res.render( 'homepage', { books, authors, genres })
    })
})

module.exports = router
