import database, { Book } from '../database'
import express from 'express'
const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  Book.all()
    .then((books) => {

      console.log('All Books', books);
      res.render('homepage', { books })
    })
})

module.exports = router
