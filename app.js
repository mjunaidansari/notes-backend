const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')

require('express-async-errors') // for eliminating try-catch in async functions

const app = express()

// setting strict query to false will save the fields in db even if not mentioned in schema 
mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB: ', error.message)
    })

//middleware are called in order they are taken into use
app.use(express.static('build'))
app.use(cors())
app.use(express.json()) // middleware for parsing json data and assigning it to request object as body parameter
app.use(middleware.requestLogger) //used after json-parser because body parameter is provided by json-parser

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app