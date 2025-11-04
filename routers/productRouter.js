const express = require(`express`)
const { authorize, authenticate} = require(`../middlewares/Auth`)
const { createProduct, getOneProduct, getAllForOneStore, getAllProducts, getTopProducts, updateProduct, deleteProduct, searchProducts, saveProductForLater } = require("../controllers/productController")
const router = express.Router()

// router.post(`/:merchantId/create-product`, authorize, createProduct)
router.post('/createProduct/:merchantId/:categoryId',authorize, createProduct);


router.get(`/getoneproduct/:productId`, getOneProduct)

router.get(`/allstoreproducts/:merchantId`, getAllForOneStore)

router.get(`/allproducts`, getAllProducts)

router.get(`/topproducts`, getTopProducts)

router.put(`/:merchantId/update-product/:productId`, authorize, updateProduct)

router.post(`/searchproducts`, searchProducts)

router.post(`/saveforlater`, authenticate, saveProductForLater)

router.delete(`/delete-product/:productId`, authorize, deleteProduct)

module.exports = router