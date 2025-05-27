const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const app = express()

console.log(`Process::`,process.env)
// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
// init db
require('./dbs/init.mongodb.js')
const {checkOverLoad,countConnect} = require('./helpers/check.connect.js')
countConnect()
checkOverLoad()
// init routes
app.get('/', (req, res,next) => {
    const strCompress = 'This is a test string to demonstrate compression in Express.js. ' +
        'It is a long string that will be compressed to reduce its size when sent over the network. ' +
        'Compression helps improve performance by reducing the amount of data that needs to be transferred.';

    return res.status(200).json({
        message: 'Welcome to WSV eCommerce API',
        metadata: strCompress.repeat(100000)
    })
})


// handling error

module.exports = app