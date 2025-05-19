//  Generate a random SKU for testing
const generateTestSKU  = () => {
    return `TEST-${Math.floor(Math.random() * 1000000)}-${Date.now()}`;
}

// Create test product data
const createTestProductData = (overrides = {}) => {
    return {
        name: `Test Product ${Math.floor(Math.random() * 1000)}`,
        description: 'This is a test product description.',
        price: Math.floor(Math.random() * 100) + 1,
        sku: generateTestSKU(),
        status: 'Available',
        tags: ['test', 'product'],
        stock: Math.floor(Math.random() * 100),
        images: [
            {
                url: 'https://example.com/image1.jpg',
                alt: 'Image 1'
            },
            {
                url: 'https://example.com/image2.jpg',
                alt: 'Image 2'
            }
        ],
        ...overrides
    }

}

module.exports = {
    generateTestSKU,
    createTestProductData
}
