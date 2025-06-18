'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const router = express.Router()
const {asyncHandler} = require('../../helpers/asyncHandler')
const {authenticationV2} = require('../../auth/authUtils')

//search product
router.get('/search/:keySearch',asyncHandler(productController.getListSearchProduct))
router.get('',asyncHandler(productController.getAllProducts))
router.get('/:product_id',asyncHandler(productController.findProduct))
//authentication
router.use(authenticationV2)

// Create, Publish, Unpublish product
router.post('', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.post('/publish/:id',asyncHandler(productController.publishProduct))
router.post('/unpublish/:id',asyncHandler(productController.unPublishProduct))

// Query
router.get('/draft/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishedForShop))
module.exports = router