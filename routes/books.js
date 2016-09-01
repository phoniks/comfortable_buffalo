import database, { Book, Author, Genre } from '../database'
import express from 'express'
import Debug from 'debug'
const debug = Debug( 'bookstore_buffalo:route:books' )

  const router = express.Router()

router.get('/:id', ( req, res ) => {
  const { id } = req.params
  Promise.all( [Book.getBookInfo(id) ])
    .then(result => {
      const results = result[0][0]
      const authId = results.author_id
      const genreId = results.genre_id
      debug('authId: '+authId+' GenreId: '+genreId)
      return Promise.all([
        Author.getBooks(authId),
        Genre.getBooks(genreId),
        new Promise( (reject, resolve) => resolve(results))
      ])
      .then(books =>{
        console.log(books)
        const [booksByAuthor, booksByGenre, thisBooksData] = books
        debug(booksByAuthor+' '+booksByGenre+' '+thisBooksData)
      })
      res.render('book_details', { thisBooksData, booksByAuthor, booksByGenre })
    }).catch(error => {
    res.send(error.message)
  })
})

export default router