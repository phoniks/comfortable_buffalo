class SimpleInsert {
  constructor( table, options={}, suppress=false ){
    if( table === undefined  ) {
      throw 'Table parameter is required'
    } else if( typeof( table ) !== 'string' ) {
      throw( 'Table parameter must be string' )
    }

    this.table = table

    this.columns = Object.keys( options )
    this.values = this.columns.map( key => `'${options[ key ]}'` )
    this.suppress = suppress
  }

  toString(){
    return `INSERT INTO ${this.insertInto()} VALUES ${this.insertValues()} ${this.returning()}`
  }

  insertInto(){
    return `${this.table}(${this.columns.join(', ')})`
  }

  insertValues(){
    return `(${this.values.join(', ')})`
  }

  returning() {
    return this.suppress ? '' : ' RETURNING id'
  }
}

export default SimpleInsert
