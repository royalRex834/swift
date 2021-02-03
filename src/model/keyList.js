"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyList = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
exports.KeyList = new mongoose_1.default.Schema({
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
});
module.exports = mongoose_1.default.model('KeyList', exports.KeyList);
