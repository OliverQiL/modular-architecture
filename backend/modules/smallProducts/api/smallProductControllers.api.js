const smallProductHelpers = require('../functions/smallProductHelpers.functions.js')

// ====================================
// CRUD CONTROLLERS
// ====================================

// GET /api/products - Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await smallProductHelpers.findAllProducts()
        res.json({
            success: true,
            count: products.length,
            data: products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message 
        })
    }
}

// GET /api/products/:id - Get a product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await smallProductHelpers.findProductById(id)

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }

    res.json({
        success: true,
        data: product
    })

  } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    })
  }
}

// POST /api/products - Create a new product
const createProduct = async (req, res) => {
  try {
    const productData = req.body
    const product = await smallProductHelpers.createProduct(productData)

    res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
    })
  } catch (error) {
    res.status(400).json({
        success: false,
        message: error.message
    })
  }
}

// PUT /api/products/:id - Update a product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body
        const product = await smallProductHelpers.updateProduct(id, updates)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            }) 
        }   

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// DELETE /api/products/:id - Delete a product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await smallProductHelpers.deleteProduct(id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        res.json({
            success: true,
            message: 'Product deleted successfully',
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}
