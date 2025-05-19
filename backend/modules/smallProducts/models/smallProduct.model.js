import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true, 
        maxlength: [100, 'Name cannot exceed 100 characters'],
        unique: true
    },

    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    price: {
        type: Number,
        required: [true, 'Product price is required'],
        validate: {
            validator: function(value) {
                return value > 0 && value < 100
            },
            message: 'Price of small product must be between $0.01 and $100'
        }
    },

    sku: {
        type: String,
        required: [true, 'Product SKU is required'],
        unique: true,
        uppercase: true,
        match: [/^[A-Z0-9-]+$/, 'SKU can only contain letters, numbers, and hyphens']
    },

    status: {
        type: String,
        required: true,
        enum: {
            values: ['Available', 'Unavailable', 'Waitlist Available'],
            message: '{VALUE} is not a valid status'
        },
        default: 'Available'
    },

    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],

    stock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },

    images: [{
        url: {
            type: String,
            required: true,
            validate: {
                validator: function(value) {
                    return /^https?:\/\/.+/.test(value)
                },
                message: 'Please provide a valid URL'
            }
        },
        alt: {
            type: String,
            default: ''
        }
    }],

    category: {
        type: String,
        trim: true,
        lowercase: true
    },

    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
        
}, {
    timestamps: true,
    versionKey: false
})

// Compound indexes for common queries
productSchema.index({ status: 1, isActive: 1 })
productSchema.index({ name: 'text', description: 'text' }) // For text search

export default mongoose.model('Product', productSchema)
