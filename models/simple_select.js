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
  }
}
