import chai from 'chai'
import chaiHttp from 'chai-http'
import mongoose from 'mongoose'
import Product from '../models/Product.js'
import app from '../../../server.js' // Import your Express app

const { expect } = chai
chai.use(chaiHttp)

describe('Product API', () => {
  beforeEach(async () => {
    // Clear products collection before each test
    await Product.deleteMany({})
  })

  // Sample product for testing
  const sampleProduct = {
    name: 'Test Product',
    description: 'Test Description',
    price: 29.99,
    sku: 'TEST-001',
    status: 'Available',
    stock: 100
  }

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      // Add some test products
      await Product.create(sampleProduct)
      await Product.create({
        ...sampleProduct,
        name: 'Another Product',
        sku: 'TEST-002'
      })

      const res = await chai.request(app).get('/api/products')

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body.success).to.equal(true)
      expect(res.body.data).to.be.an('array')
      expect(res.body.data).to.have.lengthOf(2)
    })

    it('should return empty array when no products exist', async () => {
      const res = await chai.request(app).get('/api/products')

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body.success).to.equal(true)
      expect(res.body.data).to.be.an('array')
      expect(res.body.data).to.have.lengthOf(0)
    })
  })

  describe('POST /api/products', () => {
    it('should create a new product with valid data', async () => {
      const res = await chai.request(app)
        .post('/api/products')
        .send(sampleProduct)

      expect(res).to.have.status(201)
      expect(res.body).to.be.an('object')
      expect(res.body.success).to.equal(true)
      expect(res.body.data).to.have.property('_id')
      expect(res.body.data.name).to.equal(sampleProduct.name)
      expect(res.body.data.price).to.equal(sampleProduct.price)
      
      // Verify it was added to the database
      const dbProduct = await Product.findById(res.body.data._id)
      expect(dbProduct).to.exist
      expect(dbProduct.name).to.equal(sampleProduct.name)
    })

    it('should return error with invalid data', async () => {
      const invalidProduct = {
        // Missing required fields
        description: 'Invalid product'
      }

      const res = await chai.request(app)
        .post('/api/products')
        .send(invalidProduct)

      expect(res).to.have.status(400)
      expect(res.body).to.be.an('object')
      expect(res.body.success).to.equal(false)
      expect(res.body.message).to.exist
    })
  })

  describe('GET /api/products/:id', () => {
    it('should return a product with valid id', async () => {
      const product = await Product.create(sampleProduct)

      const res = await chai.request(app)
        .get(`/api/products/${product._id}`)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body.success).to.equal(true)
      expect(res.body.data._id).to.equal(product._id.toString())
      expect(res.body.data.name).to.equal(product.name)
    })

    it('should return 404 with invalid id', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      
      const res = await chai.request(app)
        .get(`/api/products/${fakeId}`)

      expect(res).to.have.status(404)
      expect(res.body).to.be.an('object')
      expect(res.body.success).to.equal(false)
    })
  })

  describe('PUT /api/products/:id', () => {
    it('should update a product with valid data', async () => {
      const product = await Product.create(sampleProduct)
      const update = { price: 39.99, name: 'Updated Product' }

      const res = await chai.request(app)
        .put(`/api/products/${product._id}`)
        .send(update)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body.success).to.equal(true)
      expect(res.body.data.name).to.equal(update.name)
      expect(res.body.data.price).to.equal(update.price)
      
      // Verify it was updated in the database
      const dbProduct = await Product.findById(product._id)
      expect(dbProduct.name).to.equal(update.name)
      expect(dbProduct.price).to.equal(update.price)
    })

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      
      const res = await chai.request(app)
        .put(`/api/products/${fakeId}`)
        .send({ name: 'Updated Name' })

      expect(res).to.have.status(404)
      expect(res.body).to.be.an('object')
      expect(res.body.success).to.equal(false)
    })
  })

  describe('DELETE /api/products/:id', () => {
    it('should delete a product with valid id', async () => {
      const product = await Product.create(sampleProduct)

      const res = await chai.request(app)
        .delete(`/api/products/${product._id}`)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body.success).to.equal(true)
      
      // Verify it was deleted from the database
      const dbProduct = await Product.findById(product._id)
      expect(dbProduct).to.be.null
    })

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      
      const res = await chai.request(app)
        .delete(`/api/products/${fakeId}`)

      expect(res).to.have.status(404)
      expect(res.body).to.be.an('object')
      expect(res.body.success).to.equal(false)
    })
  })
})
