class SimpleJoin {
  constructor( table, columns, joins, filter ){
    this.table = table
    this.columns = columns
    this.joins = joins
    this.filter = filter
  }

  toString() {
    // SELECT books.*, authors.name, authors.id as author_id
    // JOIN book_authors ON book_authors.book_id=books.id JOIN authors ON book_authors.author_id=authors.id
    // WHERE book_authors.author_id=1"
    return `SELECT ${this.sqlColumns()} FROM ${this.table} ${this.sqlJoins()} ${this.where()}`
  }

  sqlColumns() {
    return Object.keys( this.columns ).map( table => {
      return this.mergeFields( table, this.columns[ table ] )
    }).join( ', ' )
  }

  mergeFields( table, fields ) {
    return fields.map( entry => {
      if( typeof( entry ) === 'string' ) {
        return `${table}.${entry}`
      } else {
        return `${table}.${entry[ 0 ]} as ${entry[ 1 ]}`
      }
    }).join( ', ' )
  }

  sqlJoins() {
    return Object.keys( this.joins ).map( joinTable => {
      return `JOIN ${joinTable} ON ${this.joins[ joinTable ][0]}=${this.joins[ joinTable ][1]}`
    }).join( ' ' )
  }

  where() {
    return `WHERE ${this.filter.join( '=' )}`
  }
}

export default SimpleJoin
