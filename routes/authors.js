import database, { Author } from '../database'
import express from 'express'
const router = express.Router()

router.get('/:id', ( req, res ) => {
  const { id } = req.params

  Author.getBooks(id).then( books => {
    console.log('Message', books);
    res.render('author_details', { books })
  })
})

export default router
