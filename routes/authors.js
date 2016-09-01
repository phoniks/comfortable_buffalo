import database, { Author } from '../database'
import express from 'express'
const router = express.Router()

router.get('/:id', ( req, res ) => {
  const { id } = req.params
  Promise.all([ Author.findOne(id), Author.getBooks(id) ])
    .then(results => {
      const [ author, books ] = results
      res.render('author_details', { author, books, author_id: id })
    })
})

router.get('/edit/:id', ( req, res ) => {
  const { id } = req.params
  Author.findOne(id).then(author => {
    res.render('edit_author', { author, id })
  })
})

router.post('/edit_author/:id', ( req, res ) => {
  const { id } = req.params
  Author.update(parseInt(id), req.body).then( author_id => {
    res.redirect( `/authors/${id}` )
  })
})

export default router
