const databaseName = 'bookstore_buffalo'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')()
const db = pgp(connectionString)

import SimpleSelect from './models/simple_select'
import SimpleInsert from './models/simple_insert'

const genericFunctions = tableName => {

  return {
    all: (page, size) => db.any( (new SimpleSelect( tableName, { page, size } )).toString()),
    one: id => db.one( (new SimpleSelect( tableName, { where: [{ id }] } )).toString() )
    create: () => db.one( (new SimpleInsert( tableName, { where: [{ id }] } )).toString() )
  }
}

const User = Object.assign(
  {
    find: (email, password) => {
      const fields = [ 'id', 'email', 'name', 'bio', 'img_url', 'admin' ]
      const where = [ {email}, {password} ]

      return db.one(
        (new SimpleSelect( 'users', { where, fields } )).toString()
      )
    }
  },

  genericFunctions( 'users' )
)

export { Book, Genre, User, Search, Author }
