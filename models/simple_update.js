class SimpleUpdate {
  constructor(table, id, fields={}) {
    this.table = table
    this.fields = fields
    this.id = id
  }

  toString(){
    return `UPDATE ${this.table} SET ${this.updateFields()} WHERE id=${this.id} RETURNING id`
  }

  updateFields() {
    return Object.keys( this.fields ).map( key => `${key} = '${this.fields[ key ]}'` ).join(', ')
  }
}

export default SimpleUpdate
