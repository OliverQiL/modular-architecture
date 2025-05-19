import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import productRoutes from './modules/smallProducts/routes.js'

const app = express()

dotenv.config()

if (process.env.NODE_ENV !== 'test') {
    connectDB()
}

app.use(express.json())

app.use('/api/products', productRoutes)

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    })
})

app.use('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the API'
    })
})

const PORT = process.env.PORT

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    })
}

export default app
