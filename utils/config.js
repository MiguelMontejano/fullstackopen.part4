require('dotenv').config() //Con esto accedo a la variables de entorno definidas en .env, previamente he instalado dotenv

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
    PORT, MONGODB_URI
}