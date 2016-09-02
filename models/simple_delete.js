class SimpleDelete {
  constructor(table, id) {
    this.table = table
    this.id = id
  }

  toString() {
    const sql = `DELETE FROM ${this.table} WHERE id=${this.id}`
    return sql
  }
}

export default SimpleDelete
