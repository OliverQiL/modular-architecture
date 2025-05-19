const express = require('express');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('./api/smallProductControllers.api.js')

const router = express.Router();

router.get('/', getAllProducts); // Get all products

router.get('/:id', getProductById); // Get a product by ID

router.post('/', createProduct); // Create a new product

router.put('/:id', updateProduct); // Update a product

router.delete('/:id', deleteProduct); // Delete a product

module.exports = router;
