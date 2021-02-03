import mongoose from 'mongoose'

export const UserModel = new mongoose.Schema({
    credit: {
        type: Number,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    admin: {
        type:Boolean,
        default: false
    },
    registeredBy: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: false,
        default: new Date()
    }
})

module.exports = mongoose.model('UserModel', UserModel)
