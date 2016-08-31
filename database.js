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
      const fields = [ 'id', 'email', 'name', 'bio', 'image_url']
      const where = [ {email}, {password} ]

      return db.one(
        (new SimpleSelect( 'users', { where, fields } )).toString()
      )
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
    getBooks: id => { return db.any(
      `SELECT books.* FROM books JOIN book_authors ON books.id = book_authors.book_id WHERE book_authors.author_id=$1`,
      [id]
      )
    }
  },
  genericFunctions( 'authors' )
)

const Genre = Object.assign(
  {},
  genericFunctions( 'genres' )
)

export { User, Book, Author, Genre }
