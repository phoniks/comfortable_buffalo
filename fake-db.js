const databaseName = 'bookstore_buffalo'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp(connectionString);

const faker = require('faker')

const generate = function(){
  return getAllGenres()
    .then(genres => {
      let queries = [];
      for(let i = 30; i >= 0; i--){
        queries.push(createBook({
          title: faker.name.title(),
          description: faker.lorem.paragraphs(2),
          image_url: faker.image.image(100, 100),
          authors: [
            {
              name: faker.name.findName(),
              bio: faker.lorem.paragraphs(1),
              image_url: faker.image.image(100, 100),
            }
          ],
          genres: [
            faker.random.arrayElement(genres).id,
            faker.random.arrayElement(genres).id,
            faker.random.arrayElement(genres).id
          ]
        }))
      }
      return Promise.all(queries)
    })
}

const associateAuthorsWithBook = function(authorIds, bookId){
  authorIds = Array.isArray(authorIds) ? authorIds : [authorIds]
  let queries = authorIds.map(authorId => {
    const sql = `
      INSERT INTO
        book_authors(author_id, book_id)
      VALUES
        ($1, $2)
    `
    return db.none(sql, [authorId, bookId])
  })
  return Promise.all(queries)
}

const associateGenresWithBook = function(genreIds, bookId){
  genreIds = Array.isArray(genreIds) ? genreIds : [genreIds]
  let queries = genreIds.map(genreId => {
    let sql = `
      INSERT INTO
        book_genres(genre_id, book_id)
      VALUES
        ($1, $2)
    `
    return db.none(sql, [genreId, bookId])
  })
  return Promise.all(queries)
}

const getAllGenres = function(){
  return db.any('select * from genres');
}

const createAuthor = function(attributes){
  const sql = `
    INSERT INTO
      authors(name, bio, image_url)
    VALUES
      ($1, $2, $3)
    RETURNING
      id
  `
  return db.one(sql, [attributes.name, attributes.bio, attributes.image_url])
}

const createBook = function(attributes){
  const sql = `
    INSERT INTO
      books (title, description, image_url)
    VALUES
      ($1, $2, $3)
    RETURNING
      id
  `
  var queries = [
    db.one(sql, [
      attributes.title,
      attributes.description,
      attributes.image_url
    ])
  ]
  // also create the authors
  attributes.authors.forEach(author =>
    queries.push(createAuthor(author))
  )

  return Promise.all(queries)
    .then(authorIds => {
      authorIds = authorIds.map(x => x.id)
      const bookId = authorIds.shift()
      return Promise.all([
        associateAuthorsWithBook(authorIds, bookId),
        associateGenresWithBook(attributes.genres, bookId)
      ]).then(function(){
        return bookId;
      })
    })
}

module.exports = { generate }
