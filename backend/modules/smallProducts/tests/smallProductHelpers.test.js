import { expect } from 'chai'
import mongoose from 'mongoose'
import * as productHelpers from '../functions/productHelpers.js'
import Product from '../models/Product.js'

describe('Product Helper Functions', () => {
  beforeEach(async () => {
    // Clear products collection before each test
    await Product.deleteMany({})
  })

  // Sample product data
  const sampleProduct = {
    name: 'Test Product',
    description: 'Test Description',
    price: 29.99,
    sku: 'TEST-001',
    status: 'Available',
    stock: 100
  }

  describe('findAllProducts', () => {
    it('should return all products', async () => {
      // Create some test products
      await Product.create(sampleProduct)
      await Product.create({
        ...sampleProduct,
        name: 'Another Product',
        sku: 'TEST-002'
      })

      const products = await productHelpers.findAllProducts()
      
      expect(products).to.be.an('array')
      expect(products).to.have.lengthOf(2)
    })

    it('should return filtered products when filter is provided', async () => {
      // Create products with different statuses
      await Product.create(sampleProduct)
      await Product.create({
        ...sampleProduct,
        name: 'Unavailable Product',
        sku: 'TEST-002',
        status: 'Unavailable'
      })

      const products = await productHelpers.findAllProducts({ status: 'Available' })
      
      expect(products).to.be.an('array')
      expect(products).to.have.lengthOf(1)
      expect(products[0].status).to.equal('Available')
    })
  })

  describe('findProductById', () => {
    it('should return product with valid id', async () => {
      const createdProduct = await Product.create(sampleProduct)
      
      const product = await productHelpers.findProductById(createdProduct._id)
      
      expect(product).to.exist
      expect(product._id.toString()).to.equal(createdProduct._id.toString())
      expect(product.name).to.equal(createdProduct.name)
    })

    it('should return null with invalid id', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      
      const product = await productHelpers.findProductById(fakeId)
      
      expect(product).to.be.null
    })
  })

  describe('createProduct', () => {
    it('should create product with valid data', async () => {
      const product = await productHelpers.createProduct(sampleProduct)
      
      expect(product).to.exist
      expect(product).to.have.property('_id')
      expect(product.name).to.equal(sampleProduct.name)
      
      // Verify it was saved to the database
      const dbProduct = await Product.findById(product._id)
      expect(dbProduct).to.exist
    })

    it('should throw error with invalid data', async () => {
      const invalidProduct = {
        // Missing required fields
        description: 'Invalid product'
      }

      try {
        await productHelpers.createProduct(invalidProduct)
        // If it gets here, test should fail
        expect.fail('Should have thrown validation error')
      } catch (error) {
        expect(error).to.be.an('error')
        expect(error.message).to.include('required')
      }
    })
  })

  describe('updateProduct', () => {
    it('should update product with valid data', async () => {
      const createdProduct = await Product.create(sampleProduct)
      const update = { price: 39.99, name: 'Updated Product' }
      
      const product = await productHelpers.updateProduct(createdProduct._id, update)
      
      expect(product).to.exist
      expect(product.name).to.equal(update.name)
      expect(product.price).to.equal(update.price)
      
      // Verify it was updated in the database
      const dbProduct = await Product.findById(createdProduct._id)
      expect(dbProduct.name).to.equal(update.name)
    })

    it('should return null with invalid id', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      
      const product = await productHelpers.updateProduct(fakeId, { name: 'New Name' })
      
      expect(product).to.be.null
    })
  })

  describe('deleteProduct', () => {
    it('should delete product with valid id', async () => {
      const createdProduct = await Product.create(sampleProduct)
      
      const product = await productHelpers.deleteProduct(createdProduct._id)
      
      expect(product).to.exist
      expect(product._id.toString()).to.equal(createdProduct._id.toString())
      
      // Verify it was deleted from the database
      const dbProduct = await Product.findById(createdProduct._id)
      expect(dbProduct).to.be.null
    })

    it('should return null with invalid id', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      
      const product = await productHelpers.deleteProduct(fakeId)
      
      expect(product).to.be.null
    })
  })
})
