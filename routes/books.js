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

export default router