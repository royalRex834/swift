import mongoose from 'mongoose'

export const KeyModel = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    keyname: {
        type:String,
        required: true
    },
    mac_id: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('KeyModel', KeyModel)