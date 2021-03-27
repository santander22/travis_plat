const express = require('express')
const router = express.Router()
const ProductsService = require('../../services/products')

const productService = new ProductsService()

router.get('/', async function(req, res, next){
    const { tags } = req.query
    
    try {
        // to force an error in the view
        // throw new Error('This is an error pex')
        const products = await productService.getProducts({ tags })
        res.render('products', { products })
    } catch(err) {
        next(err)
    }
})

module.exports = router