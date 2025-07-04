'use strict'

const express = require('express')
const router = express.Router()
const {apiKey,permissions} = require('../auth/checkAuth')

// check api key, middleware
router.use(apiKey)

//Check permissions
router.use(permissions('0000'))
//check permissions
router.use('/v1/api/product', require('./product'))
router.use('/v1/api',require('./access'))


module.exports = router