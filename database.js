const databaseName = 'bookstore_buffalo'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')()
const db = pgp(connectionString)

import SimpleSelect from './models/simple_select'
import SimpleInsert from './models/simple_insert'
import SimpleJoin from './models/simple_join'
import Debug from 'debug'
const debug = Debug( 'bookstore_buffalo:database' )
import SimpleUpdate from './models/simple_update'
import SimpleDelete from './models/simple_delete'

import { createSalt, hashPassword, comparePassword } from './config/hashPassword'

const genericFunctions = tableName => {

  return {
    all: ( page, size ) => db.any( (new SimpleSelect( tableName, { page, size } )).toString()),
    create: fields => db.one( (new SimpleInsert( tableName, { fields } )).toString() ),
    findOne: id => db.one( (new SimpleSelect( tableName, { where: [{ id }] } )).toString() ),
    update: ( id, fields ) => db.one( (new SimpleUpdate( tableName, id, fields )).toString() ),
    delete: ( id ) => db.none( (new SimpleDelete(tableName, id)).toString() )
  }
}

const User = Object.assign(
  {
    find: (email, password) => {
      const fields = [ 'id', 'email', 'password' ]
      const where = [ {email} ]

      return db.one(
        (new SimpleSelect( 'users', { where, fields } )).toString()
      ).then( user => comparePassword( password, user ) )
    },
    createUser: ( email, password ) => {
      return createSalt( password )
        .then( hashPassword )
        .then( hash => {
          const password = hash
          return db.one( (new SimpleInsert( 'users', { email, password } )).toString() )
        })
    },
    getBooks: id => {
      const sql = new SimpleJoin(
        'books',
        { books: [ '*' ] },
        { book_favorites: ['book_favorites.book_id', 'books.id'], users: [ 'book_favorites.user_id', 'users.id' ] },
        [ 'book_favorites.user_id', id ]
      )

      return db.any( sql.toString() )
    }
  },

  genericFunctions( 'users' )
)

const Book = Object.assign(
  {
    getBookInfo: id =>{
      const sql = new SimpleJoin(
        'books',
        { books: [ '*' ], authors: [ ['id', 'author_id'], ['name', 'author_name'] ], genres: [['id', 'genre_id'], ['name','genre_name'] ] },
        { book_authors: ['book_authors.book_id', 'books.id'], authors: [ 'book_authors.author_id', 'authors.id' ], book_genres: ['book_genres.book_id','books.id'], genres: ['book_genres.book_id','books.id'] },
        [ 'books.id', id ]
      )

      return db.any( sql.toString() )
    },
    addFavorite: (book_id, user_id) => {
      const query = new SimpleInsert( 'book_favorites ', { book_id, user_id }, true )
      console.log( query.toString() )

      return db.none( query.toString() )
    },
    isFavorite: (book_id, user_id) => {
      const where = [{ book_id }, { user_id }]
      const query = new SimpleSelect( 'book_favorites', { where })

      return db.any( query.toString() )
    }
  },
  genericFunctions( 'books' )
)

const Author = Object.assign(
  {
    getBooks: id => {
      const sql = new SimpleJoin(
        'books',
        { books: [ '*' ] },
        { book_authors: ['book_authors.book_id', 'books.id'], authors: [ 'book_authors.author_id', 'authors.id' ] },
        [ 'book_authors.author_id', id ]
      )

      return db.any( sql.toString() )
    },
    forBook: id => {
      const sql = new SimpleJoin(
        'authors',
        { authors: [ '*' ] },
        { book_authors: [ 'book_authors.author_id', 'authors.id' ] },
        [ 'book_authors.book_id', id ]
      )

      return db.any( sql.toString() )
    },
    booksBy: authorId => {
      const sql = new SimpleJoin(
        'books',
        { 'books': [ 'id', 'title', 'image_url' ] },
        { book_authors: [ 'book_authors.book_id', 'books.id' ] },
        [ 'book_authors.author_id', authorId ]
      )

      return db.any( sql.toString() )
    }
  },

  genericFunctions( 'authors' )
)

const Genre = Object.assign(
  {
    getBooks: id => {
      const sql = new SimpleJoin(
        'books',
        { books: [ '*' ] },
        { book_genres: ['book_genres.book_id', 'books.id'], genres: [ 'book_genres.genre_id', 'genres.id' ] },
        [ 'book_genres.genre_id', id ]
      )

      return db.any( sql.toString() )
    },
    forBook: id => {
      const sql = new SimpleJoin(
        'genres',
        { genres: [ '*' ] },
        { book_genres: [ 'book_genres.genre_id', 'genres.id' ] },
        [ 'book_genres.book_id', id ]
      )

      return db.any( sql.toString() )
    },
    booksIn: genreId => {
      const sql = new SimpleJoin(
        'books',
        { 'books': [ 'id', 'title', 'image_url' ] },
        { book_genres: [ 'book_genres.book_id', 'books.id' ] },
        [ 'book_genres.genre_id', genreId ]
      )

      return db.any( sql.toString() )
    }
  },
  genericFunctions( 'genres' )
)

const Search = {
  forBooks: options => {
    const variables = []
    let sql = `SELECT DISTINCT(books.*) FROM books`

    if (options.search_query){
      let search_query = options.search_query
        .toLowerCase()
        .replace(/^ */, '%')
        .replace(/ *$/, '%')
        .replace(/ +/g, '%')

      variables.push(search_query)
      sql += `
      LEFT JOIN book_authors ON books.id=book_authors.book_id
      LEFT JOIN authors ON authors.id=book_authors.author_id
      LEFT JOIN book_genres ON books.id=book_genres.book_id
      LEFT JOIN genres ON genres.id=book_genres.genre_id
      WHERE LOWER(books.title)  LIKE $${variables.length}
      OR LOWER(authors.name) LIKE $${variables.length}
      OR LOWER(genres.name) LIKE $${variables.length}
      ORDER BY books.id ASC
      `
    }

    if (options.page){
      let PAGE_SIZE = parseInt( options.size || 10 )
      let offset = (parseInt(options.page) - 1) * PAGE_SIZE
      variables.push(offset)
      sql += `
      LIMIT ${PAGE_SIZE}
      OFFSET $${variables.length}
      `
    }

    return db.any(sql, variables)
  }
}

export { User, Book, Author, Genre, Search }
