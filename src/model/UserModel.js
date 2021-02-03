"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
exports.UserModel = new mongoose_1.default.Schema({
    credit: {
        type: Number,
        required: true
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
        type: Boolean,
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
});
module.exports = mongoose_1.default.model('UserModel', exports.UserModel);
