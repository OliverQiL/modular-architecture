const chai = require('chai')
const expect = chai.expect
const request = require('supertest')
const app = require('../../../server.js')
const { createTestProductData } = require('../../../tests/testHelpers.js')

describe('Product API', () => {
    describe('POST /api/products', () => {
        it('should create a new product with valid data', async () => {
            // Test data
            const testProductData = createTestProductData();

            // Make POST request to create a new product
            const response = await request(app)
                .post('/api/products')
                .send(testProductData)
                .expect('Content-Type', /json/)
                .expect(201); // 201 Created status code

            // Check if the response contains the created product
            expect(response.body).to.have.property('_id');
            expect(response.body).to.have.property('name', testProductData.name);
            expect(response.body).to.have.property('description', testProductData.description);
            expect(response.body).to.have.property('price', testProductData.price);
            expect(response.body).to.have.property('sku', testProductData.sku);
            expect(response.body).to.have.property('status', testProductData.status);
            expect(response.body).to.have.property('tags').that.includes.members(testProductData.tags);
            expect(response.body).to.have.property('stock', testProductData.stock);
            expect(response.body).to.have.property('images').that.is.an('array');
            expect(response.body.images[0]).to.have.property('url', testProductData.images[0].url);
            expect(response.body.images[0]).to.have.property('alt', testProductData.images[0].alt);
            expect(response.body.images[1]).to.have.property('url', testProductData.images[1].url);
            expect(response.body.images[1]).to.have.property('alt', testProductData.images[1].alt);

            // Check if the response contains timestamps
            expect(response.body).to.have.property('createdAt');
            expect(response.body).to.have.property('updatedAt');

            console.log('Test passed: Product created successfully');
        })
    });
})



    