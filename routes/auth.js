import express from 'express'
import database, { User } from '../database'

import passport from '../config/passport'

const router = express.Router()

const REDIRECTS = { successRedirect: '/users', failureRedirect: '/auth/login' }

router.get('/login', ( req, res ) => {
  res.render('login', { message: req.flash().toString() } )
})

router.post( '/login', passport.authenticate( 'local', REDIRECTS ), ( req, res ) => {
  res.redirect( '/users' )
})

router.get('/signup', ( req, res ) => {
  res.render('signup', {})
})

router.post( '/signup', ( req, res ) => {
  const { username, password } = req.body

  User.create( email, password )
    .then(user => {
      req.login({ id: user.id, email}, null )
      res.redirect('/')
    })
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router
