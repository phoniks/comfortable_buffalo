class SimpleInsert {
  constructor( table, options={} ){
    if( table === undefined  ) {
      throw 'Table parameter is required'
    } else if( typeof( table ) !== 'string' ) {
      throw( 'Table parameter must be string' )
    }

    this.table = table

    this.columns = Object.keys( options )
    this.values = this.columns.map( key => `'${options[ key ]}'` )
  }

  toString(){
    const sql = `INSERT INTO ${this.insertInto()} VALUES ${this.insertValues()} RETURNING id`
    return sql
  }


  insertInto(){
    return `${this.table}(${this.columns.join(', ')})`
  }

  insertValues(){
    return `(${this.values.join(', ')})`
  }
}

export default SimpleInsert
