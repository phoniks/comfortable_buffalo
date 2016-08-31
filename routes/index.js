import database, { Book, Author, Genre } from '../database'
import express from 'express'
const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  Promise.all([ Book.all(), Author.all(), Genre.all()])
    .then( results => {
      const [ books, authors, genres ] = results
      res.render( 'homepage', { books, authors, genres })
    })
})

router.get('/author-details/:author_id', ( req, res ) => {
  const { author_id } = req.params

  Author.findOne(author_id).then(author => {
    console.log(author);
    res.render('author_details', { author })
  })
})

export default router
