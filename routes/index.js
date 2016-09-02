import database, { Book, Author, Genre, Search } from '../database'
import express from 'express'
const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  const { query } = req

  const page = query.page || 1
  const size = query.size || 10

  if( query.search_query === undefined ) {
    Promise.all([ Book.all(1,4), Author.all(1,4), Genre.all(1,4)])
      .then( results => {
        const [ books, authors, genres ] = results
        res.render( 'homepage', { books, authors, genres })
      })
  } else {
    Search.forBooks({ page, size, search_query: query.search_query })
      .then( books => res.render( 'search_results', { books, page, size } ))
      .catch( error => res.send({ error, message: error.message }))
  }
})

router.get('/about', (req, res, next) => {
      res.render( 'about')
    })

export default router
