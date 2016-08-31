import SimpleJoin from '../models/simple_join'

describe( 'SimpleJoin', () => {
  it( 'should work', () => {
    const query = new SimpleJoin(
      // from table
      'books',
      // all of the columns we want returned, potentially with alias
      { books: [ '*' ], authors: [ 'name', [ 'id', 'author_id' ] ] },
      // the name of the join table
      { book_authors: ['book_authors.book_id', 'books.id'], authors: [ 'book_authors.author_id', 'authors.id' ] },
      // filter/where
      [ 'book_authors.author_id', 1 ]
    )

    expect( query.toString() ).toEqual( "SELECT books.*, authors.name, authors.id as author_id FROM books JOIN book_authors ON book_authors.book_id=books.id JOIN authors ON book_authors.author_id=authors.id WHERE book_authors.author_id=1" )
  })
})
