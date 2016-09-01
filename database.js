const databaseName = 'bookstore_buffalo'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')()
const db = pgp(connectionString)

import SimpleSelect from './models/simple_select'
import SimpleInsert from './models/simple_insert'
import SimpleJoin from './models/simple_join'

import { createSalt, hashPassword, comparePassword } from './config/hashPassword'

const genericFunctions = tableName => {

  return {
    all: (page, size) => db.any( (new SimpleSelect( tableName, { page, size } )).toString()),
    findOne: id => db.one( (new SimpleSelect( tableName, { where: [{ id }] } )).toString() ),
    create: fields => db.one( (new SimpleInsert( tableName, { fields } )).toString() )
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
    }
  },
  genericFunctions( 'users' )
)

const Book = Object.assign(
  {},
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
    }
  },
  genericFunctions( 'genres' )
)

export { User, Book, Author, Genre }
