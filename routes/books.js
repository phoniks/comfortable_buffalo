import database, { Book, Author, Genre } from '../database'
import express from 'express'
import Debug from 'debug'
const debug = Debug( 'bookstore_buffalo:route:books' )

const router = express.Router()

const getBook = id =>
  Book.findOne( id )
    .then( book =>
      Promise.all([
        Promise.resolve( book ),
        Author.forBook( id ),
        Genre.forBook( id )
      ])
    )

router.get( '/:id', ( req, res ) => {
  const { id } = req.params

  getBook( id )
    .then( result => {
      const [ book, authors, genres ] = result

      return Promise.all([
        Promise.resolve( book ),
        Promise.resolve( authors ),
        Promise.resolve( genres ),
        Genre.booksIn( genres[ 0 ].id ),
        Author.booksBy( authors[ 0 ].id )
      ])
    })
    .then( result => {
      const [ book, authors, genres, booksInGenre, booksByAuthor ] = result

      const otherGenreBooks = booksInGenre.filter( genreBook => genreBook.id !== book.id )
      const otherAuthorBooks = booksByAuthor.filter( authorBook => authorBook.id !== book.id )

      res.render( 'books/details', {
        book, authors, genres,
        booksInGenre: otherGenreBooks,
        booksByAuthor: otherAuthorBooks,
        otherGenre: genres[ 0 ].name,
        otherAuthor: authors[ 0 ].name
      })
    }).catch(error => res.send( error.message ) )
})

router.get('/edit/:id', ( req, res ) => {
  const { id } = req.params
  Book.getBookInfo(id).then(book => {
    const populate = book[0]
    debug(populate)
    res.render('books/edit_book', { populate, id })
  })
})

router.post('/edit_book/:id', ( req, res ) => {
  const { id } = req.params
  Book.update(id, req.body).then( book_id => {
    debug(book_id)
    res.redirect( `/books/${id}` )
  })
})

router.get('/delete/:id', ( req, res ) => {
  const { id } = req.params
  Book.delete(id).then( result => res.redirect( '/' ) )
})

export default router