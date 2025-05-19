const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const productRoutes = require('./modules/smallProducts/routes')

const app = express()

dotenv.config()

// Connect to MongoDB if not in test mode as tests handle their own connection
if (process.env.NODE_ENV !== 'test') {
    connectDB()
}

app.use(express.json())

// Routes
app.use('/api/products', productRoutes)

// Test route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API is working'
    })
})

// Error handler 
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    })
})

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    })
})

const PORT = process.env.PORT

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    })
}

module.exports = { app }
