'use strict'

const express = require('express')
const router = express.Router()

router.use('/v1/api',require('./access'))
// router.get('', (req, res, next) => {
//     return res.json({
//         message: 'Welcome to the API',
//         version: '1.0.0',
//         status: 'OK'
//     })
// })

module.exports = router