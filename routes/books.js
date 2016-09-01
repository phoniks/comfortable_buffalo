import database, { Book } from '../database'
import express from 'express'
import Debug from 'debug'
const debug = Debug( 'bookstore_buffalo:route:books' )

const router = express.Router()

router.get('/:id', ( req, res ) => {
  const { id } = req.params
  Book.getBookInfo(id).then( results => {
    debug(results)
    res.render('book_details', { results })
  }).catch(error => {
    res.send({error, message: error.message })
  })
})

export default router
