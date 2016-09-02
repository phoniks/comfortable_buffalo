import express from 'express'
import flash from 'connect-flash'
import path from 'path'
import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from 'express-session'

import passport from './config/passport'

import routes from './routes/index'
import users from './routes/users'
import auth from './routes/auth'
import authors from './routes/authors'
import genres from './routes/genres'
import books from './routes/books'

const sessionConfig = {
  secret: 'blarg',
  resave: false,
  saveUninitialized: false
}

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session( sessionConfig ))
app.use(flash())

app.use( passport.initialize() )
app.use( passport.session() )

app.use('/', routes)
app.use('/users', users)
app.use('/auth', auth)
app.use('/authors', authors)
app.use('/genres', genres)
app.use('/books', books)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})


module.exports = app
