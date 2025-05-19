// modules/products/functions/productHelpers.js
import Product from '../models/smallProduct.model.js'

// ====================================
// CRUD OPERATIONS
// ====================================

// Get all products with optional filtering
export const findAllProducts = async (filters = {}) => {
  try {
    return await Product.find(filters).sort({ createdAt: -1 })
  } catch (error) {
    throw new Error(`Error fetching products: ${error.message}`)
  }
}

// Find product by ID
export const findProductById = async (id) => {
  try {
    return await Product.findById(id)
  } catch (error) {
    throw new Error(`Error finding product: ${error.message}`)
  }
}

// Create a new product
export const createProduct = async (productData) => {
  try {
    const product = new Product(productData)
    return await product.save()
  } catch (error) {
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      throw new Error(`${field} already exists`)
    }
    throw new Error(`Error creating product: ${error.message}`)
  }
}

// Update a product
export const updateProduct = async (id, updates) => {
  try {
    return await Product.findByIdAndUpdate(
      id, 
      updates, 
      { 
        new: true,           // Return updated document
        runValidators: true  // Run schema validations
      }
    )
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      throw new Error(`${field} already exists`)
    }
    throw new Error(`Error updating product: ${error.message}`)
  }
}

// Delete a product
export const deleteProduct = async (id) => {
  try {
    return await Product.findByIdAndDelete(id)
  } catch (error) {
    throw new Error(`Error deleting product: ${error.message}`)
  }
}

// ====================================
// SEARCH & FILTERING
// ====================================

// Search products by name or description using text index
export const searchProducts = async (searchTerm) => {
  try {
    return await Product.find({
      $text: { $search: searchTerm }
    }).sort({ score: { $meta: 'textScore' } })
  } catch (error) {
    throw new Error(`Error searching products: ${error.message}`)
  }
}

// Find products by status
export const findProductsByStatus = async (status) => {
  try {
    return await Product.find({ status }).sort({ createdAt: -1 })
  } catch (error) {
    throw new Error(`Error finding products by status: ${error.message}`)
  }
}

// Find products with pagination
export const findProductsPaginated = async (page = 1, limit = 10, filters = {}) => {
  try {
    const skip = (page - 1) * limit
    const products = await Product.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const total = await Product.countDocuments(filters)
    
    return {
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    }
  } catch (error) {
    throw new Error(`Error fetching paginated products: ${error.message}`)
  }
}

// ====================================
// BUSINESS LOGIC & ANALYTICS
// ====================================

// Get low stock products
export const findLowStockProducts = async (threshold = 10) => {
  try {
    return await Product.find({ 
      stock: { $lte: threshold },
      status: 'Available'
    }).sort({ stock: 1 })
  } catch (error) {
    throw new Error(`Error finding low stock products: ${error.message}`)
  }
}

// Get product statistics
export const getProductStats = async () => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          totalStock: { $sum: '$stock' },
          lowStockCount: {
            $sum: { $cond: [{ $lte: ['$stock', 10] }, 1, 0] }
          }
        }
      }
    ])
    
    const statusCounts = await Product.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])
    
    return {
      ...stats[0],
      statusBreakdown: statusCounts
    }
  } catch (error) {
    throw new Error(`Error calculating product stats: ${error.message}`)
  }
}

// Check if SKU exists
export const checkSkuExists = async (sku, excludeId = null) => {
  try {
    const query = { sku: sku.toUpperCase() }
    if (excludeId) {
      query._id = { $ne: excludeId }
    }
    const product = await Product.findOne(query)
    return !!product
  } catch (error) {
    throw new Error(`Error checking SKU: ${error.message}`)
  }
}

// ====================================
// BULK OPERATIONS
// ====================================

// Bulk update stock levels
export const bulkUpdateStock = async (updates) => {
  try {
    const bulkOps = updates.map(({ id, stock }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { stock } },
        options: { runValidators: true }
      }
    }))
    
    return await Product.bulkWrite(bulkOps)
  } catch (error) {
    throw new Error(`Error bulk updating stock: ${error.message}`)
  }
}

// Bulk delete products
export const bulkDeleteProducts = async (ids) => {
  try {
    return await Product.deleteMany({ _id: { $in: ids } })
  } catch (error) {
    throw new Error(`Error bulk deleting products: ${error.message}`)
  }
}