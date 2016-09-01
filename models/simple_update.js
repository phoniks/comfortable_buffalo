class SimpleUpdate {
  constructor(table, id, fields={}) {
    this.table = table
    this.fields = fields
    this.id = id
  }

  toString(){
    const sql = `UPDATE ${this.table} SET ${this.updateFields()} WHERE id=${this.id} RETURNING id`
    console.log('Update, SQL', sql);
    return sql
  }

  updateFields() {
    return Object.keys( this.fields ).map( key => `${key} = '${this.fields[ key ]}'` ).join(', ')
  }
}

export default SimpleUpdate
