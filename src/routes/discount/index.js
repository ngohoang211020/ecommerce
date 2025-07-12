'use strict'

const express = require('express')
const discountController = require('../../controllers/discount.controller')
const router = express.Router()
const {asyncHandler} = require('../../helpers/asyncHandler')
const {authenticationV2} = require('../../auth/authUtils')


// Get amount of discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodes))

router.use(authenticationV2)

router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getDiscountCodesWithProducts))

module.exports = router