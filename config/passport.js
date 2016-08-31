import passport from 'passport'
import { Strategy } from 'passport-local'

import { User } from '../database'

const verify = (email, password, done) => {
  User.find( email, password )
    .then( user => {
      done( null, user ? user : false )
    })
    .catch( error => done( error ) )
}

const usernameField = 'email'
const passwordField = 'password'

passport.use( new Strategy({ usernameField, passwordField }, verify ) )

passport.serializeUser( ( user, done ) => {
  done( null, user.id )
})

passport.deserializeUser( ( id, done ) => {
  User.findOne( id ).then( user => {
    const { id, email } = user
    done( null, { id, email } )
  })
  .catch( error => done( error ) )
})

export default passport
