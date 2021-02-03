"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
exports.KeyModel = new mongoose_1.default.Schema({
    key: {
        type: String,
        required: true
    },
    keyname: {
        type: String,
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
});
module.exports = mongoose_1.default.model('KeyModel', exports.KeyModel);
