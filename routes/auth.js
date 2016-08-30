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

router.post( '/signup', ( req, res, next ) => {
  const { email, password } = req.body

  User.createUser( email, password )
    .then( user => {
      console.log('User', user);

      req.login({ id: user.id, email}, error => {
        if( error ) {
          next( error )
        }

        res.redirect( '/' )
      })
    })
    .catch( error => {
      res.render( 'signup', { message: 'That email address is not available.' })
    })
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router
