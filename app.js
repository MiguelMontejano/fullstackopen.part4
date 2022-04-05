const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
        .then(() => {
            logger.info('connected to MongoDB')
        })
        .catch(error => {
            logger.error('error connecting to MongoDB:', error.message)
        })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint) //Cada ruta que vaya a algun lado que no sea api/blogs/<lo definido en blogs.js> ira aqui y se tratara como se debe (devolviendo 404)
app.use(middleware.errorHandler)

module.exports = app