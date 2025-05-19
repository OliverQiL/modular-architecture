const chai = require('chai')
const expect = chai.expect
const request = require('supertest')
const app  = require('../../../server.js')  // Correct import based on your server.js export
const { createTestProductData } = require('../../../tests/testHelpers.js')

describe('Product API', function() {  // Add 'function' to use this.timeout
    describe('POST /api/products', () => {
        it('should create a new product with valid data', async function() {  // Add 'function' to use this.timeout
            this.timeout(5000);  // Increase timeout to 5 seconds
            
            // Test data
            const testProductData = createTestProductData();
            console.log('Test Product Data:', testProductData);
            
            // Make POST request to create a new product
            console.log('Making POST request to /api/products');
            const response = await request(app)
                .post('/api/products')
                .send(testProductData);
                
            console.log('Response:', response.body);
            
            // Check status code
            expect(response.status).to.equal(201);
            
            // Check success flag
            expect(response.body).to.have.property('success', true);
            
            // Check if the response contains the created product inside the data property
            expect(response.body).to.have.property('data');
            const product = response.body.data;
            
            expect(product).to.have.property('_id');
            expect(product).to.have.property('name', testProductData.name);
            expect(product).to.have.property('description', testProductData.description);
            expect(product).to.have.property('price', testProductData.price);
            expect(product).to.have.property('sku', testProductData.sku);
            expect(product).to.have.property('status', testProductData.status);
            expect(product).to.have.property('tags').that.includes.members(testProductData.tags);
            expect(product).to.have.property('stock', testProductData.stock);
            expect(product).to.have.property('images').that.is.an('array');
            expect(product.images[0]).to.have.property('url', testProductData.images[0].url);
            expect(product.images[0]).to.have.property('alt', testProductData.images[0].alt);
            expect(product.images[1]).to.have.property('url', testProductData.images[1].url);
            expect(product.images[1]).to.have.property('alt', testProductData.images[1].alt);

            // Check if the response contains timestamps
            expect(product).to.have.property('createdAt');
            expect(product).to.have.property('updatedAt');

            console.log('Test passed: Product created successfully');
        });
    });
});