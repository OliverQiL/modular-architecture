import { expect } from 'chai'
import Product from '../models/Product.js'

describe('Product Model', () => {
  beforeEach(async () => {
    // Clear products collection before each test
    await Product.deleteMany({})
  })

  it('should create a new product successfully', async () => {
    const productData = {
      name: 'Test Product',
      description: 'Test Description',
      price: 29.99,
      sku: 'TEST-001',
      status: 'Available',
      stock: 100
    }

    const product = new Product(productData)
    const savedProduct = await product.save()

    expect(savedProduct).to.have.property('_id')
    expect(savedProduct.name).to.equal(productData.name)
    expect(savedProduct.price).to.equal(productData.price)
  })

  it('should fail when required fields are missing', async () => {
    const product = new Product({
      // Missing required fields
      description: 'Test Description'
    })

    try {
      await product.save()
      // If it reaches here, test should fail
      expect.fail('Validation should have failed')
    } catch (error) {
      expect(error).to.be.an('error')
      expect(error.name).to.equal('ValidationError')
      expect(error.errors.name).to.exist
    }
  })

  it('should enforce price validation', async () => {
    const product = new Product({
      name: 'Test Product',
      description: 'Test Description',
      price: -10, // Invalid price
      sku: 'TEST-001',
      status: 'Available'
    })

    try {
      await product.save()
      expect.fail('Validation should have failed')
    } catch (error) {
      expect(error).to.be.an('error')
      expect(error.name).to.equal('ValidationError')
    }
  })

  it('should enforce unique SKU', async () => {
    // Create first product
    await Product.create({
      name: 'Product 1',
      description: 'Description 1',
      price: 29.99,
      sku: 'UNIQUE-001',
      status: 'Available',
      stock: 100
    })

    // Try to create second product with same SKU
    const duplicateProduct = new Product({
      name: 'Product 2',
      description: 'Description 2',
      price: 39.99,
      sku: 'UNIQUE-001', // Same SKU
      status: 'Available',
      stock: 50
    })

    try {
      await duplicateProduct.save()
      expect.fail('Validation should have failed')
    } catch (error) {
      expect(error).to.be.an('error')
      expect(error.code).to.equal(11000) // Duplicate key error
    }
  })
})
