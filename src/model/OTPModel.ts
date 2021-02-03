import mongoose from 'mongoose'

export const otp = new mongoose.Schema({
    otp: {
        type: Number,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: false,
        default: new Date(),
        index: {
            expires: 300
        }
    }
})

module.exports = mongoose.model('otp', otp)