"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otp = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
exports.otp = new mongoose_1.default.Schema({
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
});
module.exports = mongoose_1.default.model('otp', exports.otp);
