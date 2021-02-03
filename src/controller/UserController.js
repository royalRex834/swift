"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUser = exports.fetchOTP = exports.saveOTP = exports.addCredit = exports.checkKeyValidity = exports.resetPassword = exports.getuser = exports.getUsersCount = exports.getKeysCount = exports.resetAllKey = exports.resetKey = exports.verifyToken = exports.generateToken = exports.generateKey = exports.updateCredit = exports.keyActivation = exports.login = exports.addAndActivateKey = exports.addKey = exports.getAllKey = exports.addUser = void 0;
var KeyModel = require('../model/KeyModel.ts');
var UserModel = require('../model/UserModel.ts');
var KeyList = require('../model/keyList');
var otp = require('../model/OTPModel');
var jwt = require('jsonwebtoken');
var privateKey = "-----BEGIN RSA PRIVATE KEY-----MIICXgIBAAKBgQDVQVhEkxNxIliPJs1nYA+L7Kk+NWxhfIJJ9LmmKz6OfRcFl5UCcpt5lFWwOi0Ekq5R2t7VZ36jWGkNbiy7nL76VgMy/lk49if5KKTqVbTjSTkcsGPS/zgv/b8dFSat/D+knuBYXBEcXZX9I8IETHULZDIId/dp239OzK5F5bro6wIDAQABAoGBAK7p6/ZDFD1FSJIR54QU3GuOb7qgowbK0yrJ2cQb0DGbFFj33bamPjPYoPfsn6QSk3x8Iy2yt8JO78ueRH6VsGWw6hSeoBha8zkyY6YKm1qrpXdO0wWVSomjYD9qE2yLNOeUzKiPKp2nVZjENuS/SuPduEYHJ7vl20fnhhaKXebBAkEA7qNCmwZ9uCGPNjyg9hSzBX6gZP7hiGPp7iqZAQ1LLwDZ52THkQ/jnGPw78i/gKFV1xMSAe6Z3IEHPAdT/GIPMQJBAOTFUvA/8ZYTMg6KMW+yc37xpieqOabVf3op/GoJwK92sIjFhQ8mTsHihiafF5mMAowjpAHI1DLP/9RTje1ACtsCQQCezY4ZU+x9h/ehhB8pIwUu9uEN1H+JH9QgZcCD7rDFiq93SJ11bzlsbSV8q/6kPri88zfciUdicYq667V8ElVBAkAjC/fAxosEKryobZNVQUlgUTTbLsDWRi7ZUEVTGVtjhhNVYK0ZvQyjt0hF8mlzJHffcDZX76RShHr01DgR+JWxAkEAhcQNmEqy52iwsXkbhSjLc+4ZDIILEot6ImhRlryb96DkB6cMJYN0CQUEP4tGc2Z5fG6jLkvcOuh0U1Si4m3gaA==-----END RSA PRIVATE KEY-----";
var publicKey = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDVQVhEkxNxIliPJs1nYA+L7Kk+NWxhfIJJ9LmmKz6OfRcFl5UCcpt5lFWwOi0Ekq5R2t7VZ36jWGkNbiy7nL76VgMy/lk49if5KKTqVbTjSTkcsGPS/zgv/b8dFSat/D+knuBYXBEcXZX9I8IETHULZDIId/dp239OzK5F5bro6wIDAQAB-----END PUBLIC KEY-----";
//Admin/SubAdmin panel login
function addUser(model) {
    return __awaiter(this, void 0, void 0, function () {
        var user, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, UserModel.findOne({ user: model.user })];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        model.save();
                        return [2 /*return*/, model.user];
                    }
                    return [2 /*return*/, null];
                case 2:
                    err_1 = _a.sent();
                    throw err_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.addUser = addUser;
//Get All Key
function getAllKey(user, page, limit) {
    return __awaiter(this, void 0, void 0, function () {
        var offset, keys, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    offset = ((page * limit) - limit);
                    return [4 /*yield*/, KeyList.find({ user: user }).sort({ date: -1 }).skip(offset).limit(limit)];
                case 1:
                    keys = _a.sent();
                    if (keys) {
                        return [2 /*return*/, keys];
                    }
                    else
                        return [2 /*return*/, null];
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    throw err_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getAllKey = getAllKey;
//add key in seperate collection to check wheteher user is entering the same key when he generated
function addKey(_key, _keyname, user) {
    return __awaiter(this, void 0, void 0, function () {
        var found, key, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, KeyList.findOne({ keyname: _keyname })];
                case 1:
                    found = _a.sent();
                    if (!found) {
                        key = new KeyList({
                            key: _key,
                            keyname: _keyname,
                            user: user,
                            activated: false,
                            date: new Date(),
                            mac_id: ''
                        });
                        key.save();
                        return [2 /*return*/, key];
                    }
                    return [2 /*return*/, null];
                case 2:
                    err_3 = _a.sent();
                    throw err_3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.addKey = addKey;
function addAndActivateKey(key, mac_id) {
    return __awaiter(this, void 0, void 0, function () {
        var keymodel, filter, update, currdate, olddate, diff, doc, currdate, olddate, diff, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, KeyList.findOne({ key: key })];
                case 1:
                    keymodel = _a.sent();
                    if (!(keymodel && keymodel.activated == false && keymodel.mac_id != mac_id)) return [3 /*break*/, 5];
                    filter = { key: key };
                    update = { mac_id: mac_id, activated: true };
                    currdate = new Date().getTime();
                    olddate = new Date(keymodel.date).getTime();
                    diff = Math.abs(currdate - olddate);
                    if (!((30 - (diff / 86400000)) < 1)) return [3 /*break*/, 2];
                    return [2 /*return*/, null];
                case 2: return [4 /*yield*/, KeyList.findOneAndUpdate(filter, update, {
                        returnOriginal: false
                    })];
                case 3:
                    doc = _a.sent();
                    if (doc) {
                        return [2 /*return*/, Math.floor(30 - (diff / 86400000))];
                    }
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    if (keymodel && keymodel.activated == true && keymodel.mac_id == mac_id) {
                        console.log({ key: key, mac: mac_id });
                        console.log({ key: keymodel.key, mac: keymodel.mac_id });
                        currdate = new Date().getTime();
                        olddate = new Date(keymodel.date).getTime();
                        diff = Math.abs(currdate - olddate);
                        if ((30 - (diff / 86400000)) < 1)
                            return [2 /*return*/, null];
                        else
                            return [2 /*return*/, Math.floor(30 - (diff / 86400000))];
                    }
                    else
                        return [2 /*return*/, null];
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_4 = _a.sent();
                    throw err_4;
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.addAndActivateKey = addAndActivateKey;
//Admin panel login
function login(id, password) {
    return __awaiter(this, void 0, void 0, function () {
        var user, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, UserModel.findOne({ user: id })];
                case 1:
                    user = _a.sent();
                    if (user != null) {
                        if (user.password == password)
                            return [2 /*return*/, user];
                        else
                            return [2 /*return*/, null];
                    }
                    return [2 /*return*/, null];
                case 2:
                    err_5 = _a.sent();
                    throw err_5;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.login = login;
//Activate key
function keyActivation(key) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, UserModel.findOne({ key: key })];
                case 1:
                    user = _a.sent();
                    if (user != null)
                        return [2 /*return*/, true];
                    else
                        return [2 /*return*/, false];
                    return [2 /*return*/];
            }
        });
    });
}
exports.keyActivation = keyActivation;
//update user credit
function updateCredit(user, reduce) {
    return __awaiter(this, void 0, void 0, function () {
        var usr, cred, filter, update, doc, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, UserModel.findOne({ user: user })];
                case 1:
                    usr = _a.sent();
                    if (!(usr != undefined && usr.credit > 0)) return [3 /*break*/, 3];
                    cred = parseInt(usr.credit) - reduce;
                    filter = { user: usr.user };
                    update = { credit: cred };
                    return [4 /*yield*/, UserModel.findOneAndUpdate(filter, update, {
                            returnOriginal: false
                        })];
                case 2:
                    doc = _a.sent();
                    return [2 /*return*/, doc.credit];
                case 3: return [2 /*return*/, null];
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_6 = _a.sent();
                    throw err_6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.updateCredit = updateCredit;
function generateKey(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.generateKey = generateKey;
//generate token
function generateToken(data, time) {
    try {
        var fs = require('fs');
        var privateKey_1 = fs.readFileSync("src/controller/private.key", 'utf8');
        var payload = {
            user: data.user,
            admin: data.admin
        };
        var token = jwt.sign(payload, privateKey_1, { expiresIn: time, algorithm: 'RS256' });
        return token;
    }
    catch (error) {
        throw error;
    }
}
exports.generateToken = generateToken;
//verify token 
function verifyToken(token) {
    var fs = require('fs');
    var publicKey = fs.readFileSync("src/controller/public.key", 'utf8');
    var verified = '';
    jwt.verify(token, publicKey, function (err, decoded) {
        if (err)
            verified = null;
        else
            verified = decoded;
    });
    return verified;
}
exports.verifyToken = verifyToken;
//reset key only admin can do it
function resetKey(keyname, user) {
    return __awaiter(this, void 0, void 0, function () {
        var keyFound, filter, update, doc, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, KeyList.findOne({ keyname: keyname })];
                case 1:
                    keyFound = _a.sent();
                    if (!(keyFound && keyFound.user == user)) return [3 /*break*/, 3];
                    filter = { keyname: keyname };
                    update = { mac_id: "", activated: false };
                    return [4 /*yield*/, KeyList.findOneAndUpdate(filter, update, {
                            returnOriginal: false
                        })];
                case 2:
                    doc = _a.sent();
                    if (doc)
                        return [2 /*return*/, true];
                    else
                        return [2 /*return*/, null];
                    _a.label = 3;
                case 3: return [2 /*return*/, null];
                case 4:
                    error_1 = _a.sent();
                    throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.resetKey = resetKey;
//Reset All key
function resetAllKey(user) {
    return __awaiter(this, void 0, void 0, function () {
        var usr, filter, update, doc, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, KeyList.find({ user: user })];
                case 1:
                    usr = _a.sent();
                    if (!usr) return [3 /*break*/, 3];
                    filter = { user: user };
                    update = { mac_id: "", activated: false };
                    return [4 /*yield*/, KeyList.updateMany(filter, update)];
                case 2:
                    doc = _a.sent();
                    if (doc.nModified > 0) {
                        return [2 /*return*/, true];
                    }
                    else
                        return [2 /*return*/, false];
                    return [3 /*break*/, 4];
                case 3: return [2 /*return*/, false];
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_7 = _a.sent();
                    throw err_7;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.resetAllKey = resetAllKey;
//get keys count
function getKeysCount(user) {
    return __awaiter(this, void 0, void 0, function () {
        var keys, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, KeyList.find({ user: user })];
                case 1:
                    keys = _a.sent();
                    if (keys) {
                        return [2 /*return*/, keys.length];
                    }
                    else
                        return [2 /*return*/, null];
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getKeysCount = getKeysCount;
// get registered by me count
function getUsersCount(user) {
    return __awaiter(this, void 0, void 0, function () {
        var users, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, UserModel.find({ registeredBy: user })];
                case 1:
                    users = _a.sent();
                    if (users) {
                        return [2 /*return*/, users.length];
                    }
                    else
                        return [2 /*return*/, null];
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    throw error_3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getUsersCount = getUsersCount;
function getuser(user) {
    return __awaiter(this, void 0, void 0, function () {
        var usr, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, UserModel.findOne({ user: user })];
                case 1:
                    usr = _a.sent();
                    if (usr)
                        return [2 /*return*/, usr];
                    else
                        return [2 /*return*/, null];
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    throw error_4;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getuser = getuser;
//reset user password
function resetPassword(user, password) {
    return __awaiter(this, void 0, void 0, function () {
        var filter, update, doc, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    filter = { user: user };
                    update = { password: password };
                    return [4 /*yield*/, UserModel.findOneAndUpdate(filter, update, {
                            returnOriginal: false
                        })];
                case 1:
                    doc = _a.sent();
                    if (doc) {
                        return [2 /*return*/, true];
                    }
                    else
                        return [2 /*return*/, false];
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    throw error_5;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.resetPassword = resetPassword;
function checkKeyValidity(_key) {
    return __awaiter(this, void 0, void 0, function () {
        var key, currdate, olddate, diff, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, KeyList.findOne({ key: _key })];
                case 1:
                    key = _a.sent();
                    if (key) {
                        currdate = new Date().getTime();
                        olddate = new Date(key.date).getTime();
                        diff = Math.abs(currdate - olddate);
                        console.log((diff / 86400000));
                        if ((diff / 86400000) <= 30 && (diff / 86400000) > 0)
                            return [2 /*return*/, Math.floor(30 - (diff / 86400000))];
                        else
                            return [2 /*return*/, null];
                    }
                    else
                        return [2 /*return*/, null];
                    return [3 /*break*/, 3];
                case 2:
                    err_8 = _a.sent();
                    throw err_8;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.checkKeyValidity = checkKeyValidity;
function addCredit(user, cred) {
    return __awaiter(this, void 0, void 0, function () {
        var usr, temp, filter, update, doc, err_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, UserModel.findOne({ user: user })];
                case 1:
                    usr = _a.sent();
                    if (usr) {
                        temp = parseInt(usr.credit) + cred;
                        filter = { user: user };
                        update = { credit: cred };
                        doc = UserModel.findOneAndUpdate(filter, update, {
                            returnOriginal: false
                        });
                        if (doc)
                            return [2 /*return*/, doc.credit];
                        else
                            return [2 /*return*/, null];
                    }
                    else
                        return [2 /*return*/, null];
                    return [3 /*break*/, 3];
                case 2:
                    err_9 = _a.sent();
                    throw err_9;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.addCredit = addCredit;
//on key generation deduct one credit
//activate key in activation (fetch mac_id and store in user mac field)
//OTP Receiver and sender
function saveOTP(model) {
    return __awaiter(this, void 0, void 0, function () {
        var session, doc, err_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 10, , 11]);
                    return [4 /*yield*/, otp.startSession()];
                case 1:
                    session = _a.sent();
                    session.startTransaction();
                    return [4 /*yield*/, otp.find({ key: model.key }).session(session)];
                case 2:
                    doc = _a.sent();
                    if (!doc) return [3 /*break*/, 6];
                    return [4 /*yield*/, otp.deleteMany({ key: model.key })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, model.save()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, session.commitTransaction()];
                case 5:
                    _a.sent();
                    session.endSession();
                    return [2 /*return*/, true];
                case 6: return [4 /*yield*/, model.save()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, session.commitTransaction()];
                case 8:
                    _a.sent();
                    session.endSession();
                    return [2 /*return*/, true];
                case 9: return [3 /*break*/, 11];
                case 10:
                    err_10 = _a.sent();
                    throw err_10;
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.saveOTP = saveOTP;
//fetch otp in swift app
function fetchOTP(key) {
    return __awaiter(this, void 0, void 0, function () {
        var findOtp, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, otp.findOne({ key: key })];
                case 1:
                    findOtp = _a.sent();
                    if (findOtp) {
                        return [2 /*return*/, findOtp.otp];
                    }
                    else
                        return [2 /*return*/, null];
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    throw error_6;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.fetchOTP = fetchOTP;
//get All user by me
function getAllUser(usr, page, limit) {
    return __awaiter(this, void 0, void 0, function () {
        var offset, user, err_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    offset = ((page * limit) - limit);
                    return [4 /*yield*/, UserModel.find({ registeredBy: usr }).sort({ date: -1 }).skip(offset).limit(limit).select({ "user": 1, "registeredBy": 1, "credit": 1, "date": 1 })];
                case 1:
                    user = _a.sent();
                    if (user) {
                        return [2 /*return*/, user];
                    }
                    else
                        return [2 /*return*/, null];
                    return [3 /*break*/, 3];
                case 2:
                    err_11 = _a.sent();
                    throw err_11;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getAllUser = getAllUser;
