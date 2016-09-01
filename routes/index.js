import database, { Book, Author, Genre } from '../database'
import express from 'express'
const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  Promise.all([ Book.all(), Author.all(), Genre.all()])
    .then( results => {
      const [ books, authors, genres ] = results
      console.log(books)
      res.render( 'homepage', { books, authors, genres })
    })
})

export default router
