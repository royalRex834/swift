import mongoose from 'mongoose'

export const KeyList = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    keyname: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true,
    },
    activated: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: new Date()
    },
    mac_id: {
        type: String,
        default: ''
    }

})

module.exports = mongoose.model('KeyList', KeyList)