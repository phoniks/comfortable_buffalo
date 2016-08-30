class SimpleSelect {
  constructor(table, options={}) {
    if( table === undefined ) {
      throw 'Table parameter is required'
    } else if ( typeof( table ) !== 'string') {
      throw('Table parameter must be a string')
    }

    this.table = table
    this.filter = options.where || []
    this.fields = options.fields || []

    // pagination
    this.page = parseInt( options.page || 1 )
    this.size = parseInt( options.size || 10 )
    this.offset = this.size * ( this.page - 1 )
  }

  toString() {
    return `SELECT ${this.queryFields()} FROM ${this.table}${this.where()} LIMIT ${this.size} OFFSET ${this.offset}`
  }

  queryFields() {
    if( this.fields.length === 0 ) {
      return '*'
    } else {
      return this.fields.join(', ')
    }
  }

  where() {
    if( this.filter.length === 0 ) {
      return ''
    } else {
      const clause = this.filter.map( object =>{
        return Object.keys( object ).map( key => `${key}='${object[key]}'`)
      }).reduce( (memo, item) => memo.concat( item ), [] )

      return ` WHERE ${clause.join( ' AND ' )}`
    }
  }
}

export default SimpleSelect
