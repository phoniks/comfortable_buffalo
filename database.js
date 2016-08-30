const databaseName = 'bookstore_buffalo'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')()
const db = pgp(connectionString)

import SimpleSelect from './models/simple_select'
import SimpleInsert from './models/simple_insert'
import { createSalt, hashPassword, comparePassword } from './config/hashPassword'

const genericFunctions = tableName => {

  return {
    all: (page, size) => db.any( (new SimpleSelect( tableName, { page, size } )).toString()),
    findOne: id => db.one( (new SimpleSelect( tableName, { where: [{ id }] } )).toString() ),
    create: () => db.one( (new SimpleInsert( tableName, { where: [{ id }] } )).toString() )
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
  {},
  genericFunctions( 'authors' )
)

const Genre = Object.assign(
  {},
  genericFunctions( 'genres' )
)

export { User, Book, Author, Genre }
