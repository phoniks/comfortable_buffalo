import Debug from 'debug'
const debug = Debug( 'bookstore_buffalo:simple_update' )

class SimpleUpdate {
  constructor(table, id, fields={}) {
    this.table = table
    this.fields = fields
    this.id = id
  }

  toString(){
    const sql = `UPDATE ${this.table} SET ${this.updateFields()} WHERE id=${this.id} RETURNING id`
    debug(sql)
    return sql
  }

  updateFields() {
    return Object.keys( this.fields ).map( key => `${key} = '${this.fields[ key ]}'` ).join(', ')
  }
}

export default SimpleUpdate
