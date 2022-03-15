const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
const { info } = require('console')

const server = http.createServer(app)

server.listen(config.PORT, () => { //El puerto que paso como primer parametro es para que el servidor escuche en ese puerto, la funcion que es el segundo parametro simplemente imprime que el servidor esta corriendo en ese puerto
    logger.info(`server running on port ${config.PORT}`)
})
