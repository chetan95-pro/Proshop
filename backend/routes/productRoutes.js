import express from 'express';
import { getProductById, getProducts } from '../controllers/productController.js';

const router = express.Router();

//@description: fetch all products
//@route: GET /api/products
//@access: Public
router.route('/').get(getProducts);

//@description: fetch single product
//@route: GET /api/products/:id
//@access: Public
router.route('/:id').get(getProductById);

export default router;