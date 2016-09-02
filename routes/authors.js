import database, { Author } from '../database'
import express from 'express'
import { loggedIn } from '../config/check-user'
import Debug from 'debug'
const debug = Debug( 'bookstore_buffalo:route:authors' )
const router = express.Router()


router.get('/:id', ( req, res ) => {
  const { id } = req.params
  const { user } = req

  Promise.all([ Author.findOne(id), Author.getBooks(id) ])
    .then(results => {
      const [ author, books ] = results
      res.render('author_details', {
        author,
        books,
        user,
        author_id: id,
      })
    })
})

router.get('/edit/:id', loggedIn, ( req, res ) => {
  const { id } = req.params
  Author.findOne(id).then(author => {
    res.render('edit_author', { author, id })
  })
})

router.post('/edit_author/:id', loggedIn, ( req, res ) => {
  const { id } = req.params
  Author.update(parseInt(id), req.body).then( author_id => {
    res.redirect( `/authors/${id}` )
  })
})

router.get('/delete/:id', loggedIn,  ( req, res ) => {
  const { id } = req.params
  Author.delete(id).then( result => res.redirect( '/' ) )
})

export default router
