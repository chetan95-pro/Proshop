import asyncHandler from 'express-async-handler'
import Product from '../models/productModal.js';

//@description: fetch all products
//@route: GET /api/products
//@access: Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).lean();
    res.json(products);
});

//@description: fetch single product
//@route: GET /api/products/:id
//@access: Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).lean();
    if(product){
        res.json(product);
    }else{
        res.status(404);
        throw new Error('Product not found');
    }
});

export { getProducts, getProductById};