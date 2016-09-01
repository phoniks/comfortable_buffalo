import database, { Author } from '../database'
import express from 'express'
import Debug from 'debug'
const debug = Debug( 'bookstore_buffalo:route:authors' )
const router = express.Router()

router.get('/:id', ( req, res ) => {
  const { id } = req.params
  Promise.all([ Author.findOne(id), Author.getBooks(id) ])
    .then(results => {
      const [ author, books ] = results
      res.render('author_details', { author, books })
    })
})

export default router
