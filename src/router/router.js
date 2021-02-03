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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var Auth_1 = require("../auth/Auth");
var UserController_1 = require("../controller/UserController");
var KeyList = require('../model/keyList');
var KeyModel = require('../model/KeyModel.ts');
var UserModel = require('../model/UserModel.ts');
var otp = require('../model/OTPModel');
var router = express_1.default.Router();
router.get('/user', Auth_1.Auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var decoded;
    return __generator(this, function (_a) {
        try {
            decoded = UserController_1.verifyToken(req.headers['access-token']);
            if (decoded) {
                UserController_1.getuser(decoded.user).then(function (user) {
                    if (user)
                        return res.status(200).json(user);
                    else
                        return res.status(401).json({ msg: 'unAuthorized user' });
                }).catch(function (err) {
                    return res.status(500).json({ msg: 'Internal Server Error', error: err });
                });
            }
            else
                return [2 /*return*/, res.status(401).json({ msg: 'UnAuthorized user' })];
        }
        catch (err) {
            return [2 /*return*/, res.status(500).json({ msg: 'Internal Server Error', error: err })];
        }
        return [2 /*return*/];
    });
}); });
//Register user
router.post('/register', Auth_1.Auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token, decoded, session, usrFound, doc, upadteCredit, doc, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = new UserModel({
                    credit: req.body.credit,
                    password: req.body.password,
                    user: req.body.user,
                    admin: false,
                    registeredBy: 'dsewa'
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 24, , 25]);
                if (user.password == "" || user.password == null ||
                    user.user == "" || user.user == null ||
                    user.credit == '' || user.credit == null)
                    return [2 /*return*/, res.status(400).json({ msg: 'please fill all details' })];
                token = req.headers['access-token'];
                decoded = UserController_1.verifyToken(token);
                if (!decoded) return [3 /*break*/, 22];
                return [4 /*yield*/, UserModel.startSession()];
            case 2:
                session = _a.sent();
                session.startTransaction();
                return [4 /*yield*/, UserModel.findOne({ user: decoded.user }).session(session)];
            case 3:
                usrFound = _a.sent();
                if (!(usrFound && usrFound.credit >= user.credit && usrFound.admin == false)) return [3 /*break*/, 14];
                return [4 /*yield*/, UserModel.findOne({ user: user.user }).session(session)];
            case 4:
                doc = _a.sent();
                if (!!doc) return [3 /*break*/, 11];
                return [4 /*yield*/, UserModel.findOneAndUpdate({ user: decoded.user }, { $inc: { credit: -user.credit } }).session(session)];
            case 5:
                upadteCredit = _a.sent();
                if (!upadteCredit) return [3 /*break*/, 8];
                user.registeredBy = decoded.user;
                return [4 /*yield*/, user.save()];
            case 6:
                _a.sent();
                return [4 /*yield*/, session.commitTransaction()];
            case 7:
                _a.sent();
                session.endSession();
                return [2 /*return*/, res.status(200).json({ msg: 'yeah user registered successfully' })];
            case 8: return [4 /*yield*/, session.abortTransaction()];
            case 9:
                _a.sent();
                session.endSession();
                return [2 /*return*/, res.status(500).json({ msg: 'unable to add user please try again' })];
            case 10: return [3 /*break*/, 13];
            case 11: return [4 /*yield*/, session.abortTransaction()];
            case 12:
                _a.sent();
                session.endSession();
                return [2 /*return*/, res.status(302).json({ msg: 'user with this username already exists' })];
            case 13: return [3 /*break*/, 21];
            case 14:
                if (!(usrFound && usrFound.admin == true)) return [3 /*break*/, 20];
                return [4 /*yield*/, UserModel.findOne({ user: user.user }).session(session)];
            case 15:
                doc = _a.sent();
                if (!!doc) return [3 /*break*/, 18];
                user.registeredBy = decoded.user;
                return [4 /*yield*/, user.save()];
            case 16:
                _a.sent();
                return [4 /*yield*/, session.commitTransaction()];
            case 17:
                _a.sent();
                session.endSession();
                return [2 /*return*/, res.status(200).json({ msg: 'yeah user registered successfully' })];
            case 18:
                session.endSession();
                return [2 /*return*/, res.status(302).json({ msg: 'user with this username already exists' })];
            case 19: return [3 /*break*/, 21];
            case 20:
                session.endSession();
                return [2 /*return*/, res.status(401).json({ msg: 'You dont have enough credit, please buy credit' })];
            case 21: return [3 /*break*/, 23];
            case 22: return [2 /*return*/, res.status(401).json({ msg: 'UnAuthorized User' })];
            case 23: return [3 /*break*/, 25];
            case 24:
                err_1 = _a.sent();
                return [2 /*return*/, res.status(500).json({ msg: 'Internal Server Error', error: err_1 })];
            case 25: return [2 /*return*/];
        }
    });
}); });
//Generate key 
router.post('/admin/generate/key', Auth_1.Auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, _keyname, verified, session, user, doc, _key, key, searchKey, _key, key, searchKey, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.headers['access-token'];
                _keyname = req.body.keyname;
                if (!_keyname || _keyname == '' || _keyname.length > 10 || _keyname.length < 3)
                    return [2 /*return*/, res.status(400).json({ msg: 'please give key name between 3 to 10 characters long only' })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 24, , 25]);
                verified = UserController_1.verifyToken(token);
                if (!verified) return [3 /*break*/, 22];
                return [4 /*yield*/, UserModel.startSession()];
            case 2:
                session = _a.sent();
                session.startTransaction();
                return [4 /*yield*/, UserModel.findOne({ user: verified.user }).session(session)];
            case 3:
                user = _a.sent();
                if (!(user && user.credit > 0 && user.admin == false)) return [3 /*break*/, 13];
                return [4 /*yield*/, UserModel.findOneAndUpdate({ user: user.user }, { $inc: { credit: -1 } }).session(session)];
            case 4:
                doc = _a.sent();
                if (!doc) return [3 /*break*/, 10];
                _key = UserController_1.generateKey(15);
                key = new KeyList({
                    key: _key,
                    keyname: _keyname,
                    user: verified.user,
                    activated: false,
                    date: new Date(),
                    mac_id: ''
                });
                return [4 /*yield*/, KeyList.findOne({ keyname: _keyname })];
            case 5:
                searchKey = _a.sent();
                if (!!searchKey) return [3 /*break*/, 7];
                key.save();
                return [4 /*yield*/, session.commitTransaction()];
            case 6:
                _a.sent();
                session.endSession();
                return [2 /*return*/, res.status(200).json({ key: _key })];
            case 7: return [4 /*yield*/, session.abortTransaction()];
            case 8:
                _a.sent();
                session.endSession();
                return [2 /*return*/, res.status(302).json({ msg: 'key with this name already registered by you or someone' })];
            case 9: return [3 /*break*/, 12];
            case 10: return [4 /*yield*/, session.abortTransaction()];
            case 11:
                _a.sent();
                session.endSession();
                return [2 /*return*/, res.status(500).json({ msg: 'unable to generate key' })];
            case 12: return [3 /*break*/, 21];
            case 13:
                if (!(user && user.admin == true)) return [3 /*break*/, 19];
                _key = UserController_1.generateKey(15);
                key = new KeyList({
                    key: _key,
                    keyname: _keyname,
                    user: verified.user,
                    activated: false,
                    date: new Date(),
                    mac_id: ''
                });
                return [4 /*yield*/, KeyList.findOne({ keyname: _keyname })];
            case 14:
                searchKey = _a.sent();
                if (!!searchKey) return [3 /*break*/, 16];
                key.save();
                return [4 /*yield*/, session.commitTransaction()];
            case 15:
                _a.sent();
                session.endSession();
                return [2 /*return*/, res.status(200).json({ key: _key })];
            case 16: return [4 /*yield*/, session.abortTransaction()];
            case 17:
                _a.sent();
                session.endSession();
                return [2 /*return*/, res.status(302).json({ msg: 'key with this name already registered by you or someone' })];
            case 18: return [3 /*break*/, 21];
            case 19: return [4 /*yield*/, session.abortTransaction()];
            case 20:
                _a.sent();
                session.endSession();
                return [2 /*return*/, res.status(500).json({ msg: 'unable to generate key, please try again' })];
            case 21: return [3 /*break*/, 23];
            case 22: return [2 /*return*/, res.status(401).json({ msg: 'UnAuthorized user' })];
            case 23: return [3 /*break*/, 25];
            case 24:
                err_2 = _a.sent();
                return [2 /*return*/, res.status(500).json({ msg: 'Internal Server Error', error: err_2 })];
            case 25: return [2 /*return*/];
        }
    });
}); });
router.get('/get/keys', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, page, limit, decoded, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.headers['access-token'];
                page = req.query.page;
                limit = req.query.limit;
                if (!token || token == '' || !page || page == '' || !limit || limit == '')
                    return [2 /*return*/, res.status(400).json({ msg: 'please fill all details' })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                decoded = UserController_1.verifyToken(token);
                if (!decoded) return [3 /*break*/, 3];
                return [4 /*yield*/, UserController_1.getAllKey(decoded.user, parseInt(page), parseInt(limit)).then(function (list) {
                        if (list)
                            return res.status(200).json(list);
                        else
                            return res.status(404).json({ msg: 'No Key Found' });
                    }).catch(function (err) {
                        return res.status(500).json(err);
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3: return [2 /*return*/, res.status(401).json({ msg: 'please login again' })];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_3 = _a.sent();
                return [2 /*return*/, res.status(500).json(err_3)];
            case 6: return [2 /*return*/];
        }
    });
}); });
//login
router.post('/admin/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (req.body.user == "" || req.body.password == "")
            return [2 /*return*/, res.status(400).json({ msg: 'please enter user and password' })];
        UserController_1.login(req.body.user, req.body.password).then(function (user) {
            if (user && user.credit >= 0 && user.admin == false) {
                var token = UserController_1.generateToken({ user: req.body.user, admin: false }, '1hr');
                user.password = null;
                return res.status(200).json({ user: user, token: token });
            }
            else if (user && user.credit >= 0 && user.admin == true) {
                var token = UserController_1.generateToken({ user: req.body.user, admin: true }, '1hr');
                user.password = null;
                return res.status(200).json({ user: user, token: token });
            }
            else
                return res.status(404).json({ msg: 'user does not exists' });
        }).catch(function (err) {
            console.log(err);
            return res.status(500).json(err);
        });
        return [2 /*return*/];
    });
}); });
//Activate generated key (its activated through SWIFT TATKAL EXTENSION ONLY)
router.get('/admin/activate/key', Auth_1.checkKeyRegistration, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var key, mac_id;
    return __generator(this, function (_a) {
        key = req.query.key;
        mac_id = req.query.mac_id;
        console.log("Inside router => " + req.body);
        if (!key || key == "" || !mac_id || mac_id == "")
            return [2 /*return*/, res.status(400).json({ msg: 'please give key and mac_id' })];
        try {
            UserController_1.addAndActivateKey(key, mac_id).then(function (result) {
                if (result) {
                    return res.status(200).json({ 'validity': result });
                }
                else
                    return res.status(401).json({ msg: 'Key Already Registered' });
            }).catch(function (err) {
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            });
        }
        catch (err) {
            console.log(err);
            return [2 /*return*/, res.status(500).json({ msg: 'Internal server error please try again or check your key', error: err })];
        }
        return [2 /*return*/];
    });
}); });
//Reset key can only be done by admin
router.post('/admin/reset/key', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, keyname, decoded, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.headers['access-token'];
                keyname = req.query.key;
                if (!token || token == '' || !keyname || keyname == '')
                    return [2 /*return*/, res.status(400).json('please provide keyname')];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                decoded = UserController_1.verifyToken(token);
                if (!decoded) return [3 /*break*/, 3];
                return [4 /*yield*/, UserController_1.resetKey(keyname, decoded.user).then(function (succ) {
                        if (succ)
                            return res.status(200).json({ msg: 'succesfully reset' });
                        else
                            return res.status(401).json({ msg: 'key or user is not valid' });
                    }).catch(function (err) {
                        return res.status(500).json({ msg: 'unable to reset please try again' });
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3: return [2 /*return*/, res.status(401).json({ msg: 'you can not reset key' })];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_4 = _a.sent();
                return [2 /*return*/, res.status(500).json(err_4)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get('/check', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var key;
    return __generator(this, function (_a) {
        key = req.query.key;
        if (!key || key == "")
            return [2 /*return*/, res.status(400).json({ msg: 'key not found' })];
        try {
            UserController_1.checkKeyValidity(key).then(function (val) {
                if (val)
                    res.status(200).json({ 'validity': val });
                else
                    res.status(401).json({ msg: 'validity expired' });
            });
        }
        catch (err) {
            return [2 /*return*/, res.status(500).json(err)];
        }
        return [2 /*return*/];
    });
}); });
//check user auth
router.post('/verify', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, verify;
    return __generator(this, function (_a) {
        token = req.headers['access-token'];
        if (!token || token == '')
            return [2 /*return*/, res.status(401).json({ msg: 'please login again' })];
        try {
            verify = UserController_1.verifyToken(token);
            if (verify)
                return [2 /*return*/, res.status(200).json({ msg: 'verified' })];
            else
                return [2 /*return*/, res.status(401).json({ msg: 'please login again' })];
        }
        catch (error) {
            return [2 /*return*/, res.status(500).json(error)];
        }
        return [2 /*return*/];
    });
}); });
//get keys count of a particular user
router.get('/admin/key/count', Auth_1.Auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var usr;
    return __generator(this, function (_a) {
        try {
            usr = UserController_1.verifyToken(req.headers['access-token']);
            if (usr) {
                UserController_1.getKeysCount(usr.user).then(function (count) {
                    if (count)
                        return res.status(200).json({ count: count });
                    else
                        return res.status(404).json({ msg: 'no keys found' });
                }).catch(function (err) {
                    return res.status(500).json({ msg: 'Internal Server Error', error: err });
                });
            }
        }
        catch (err) {
            return [2 /*return*/, res.status(500).json({ msg: 'Internal Server Error' })];
        }
        return [2 /*return*/];
    });
}); });
//admin can only reset password
router.post('/user/password/reset', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, user, password, decoded;
    return __generator(this, function (_a) {
        try {
            token = req.headers['access-token'];
            user = req.body.user;
            password = req.body.password;
            if (!token || token == '' || !user || user == '' || !password || password == '')
                return [2 /*return*/, res.status(400).json({ msg: 'please provide all details or you are not an Admin' })];
            decoded = UserController_1.verifyToken(token);
            if (decoded && decoded.admin == true) {
                UserController_1.resetPassword(user, password).then(function (succ) {
                    if (succ)
                        return res.status(200).json({ msg: 'password reset successfully' });
                    else
                        return res.status(404).json({ msg: 'unable to reset password' });
                }).catch(function (err) {
                    return res.status(500).json({ msg: 'Internal server error' });
                });
            }
            else
                return [2 /*return*/, res.status(401).json({ msg: 'You are not an Admin' })];
        }
        catch (error) {
            return [2 /*return*/, res.status(500).json(error)];
        }
        return [2 /*return*/];
    });
}); });
//sell credit to others
router.post('/sell/credit', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, credit, token, decoded, session, usr, doc1, doc2, session, doc, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.body.user;
                credit = parseInt(req.body.credit);
                token = req.headers['access-token'];
                if (!customer || customer == '' || !credit || credit == 0 || !token || token == '')
                    return [2 /*return*/, res.status(400).json({ msg: 'please fill all details' })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 25, , 26]);
                decoded = UserController_1.verifyToken(token);
                if (!(decoded && decoded.admin == false)) return [3 /*break*/, 16];
                return [4 /*yield*/, UserModel.startSession()];
            case 2:
                session = _a.sent();
                session.startTransaction();
                return [4 /*yield*/, UserModel.findOne({ user: decoded.user }).session(session)];
            case 3:
                usr = _a.sent();
                if (!(usr.credit > 0)) return [3 /*break*/, 13];
                return [4 /*yield*/, UserModel.findOneAndUpdate({ user: decoded.user }, { $inc: { credit: -credit } }).session(session)];
            case 4:
                doc1 = _a.sent();
                if (!doc1) return [3 /*break*/, 10];
                return [4 /*yield*/, UserModel.findOneAndUpdate({ user: customer }, { $inc: { credit: credit } }).session(session)];
            case 5:
                doc2 = _a.sent();
                if (!doc2) return [3 /*break*/, 7];
                return [4 /*yield*/, session.commitTransaction()];
            case 6:
                _a.sent();
                session.endSession();
                return [2 /*return*/, res.status(200).json({ msg: 'credit transferred successfully' })];
            case 7: return [4 /*yield*/, session.abortTransaction()];
            case 8:
                _a.sent();
                session.endSession();
                return [2 /*return*/, res.status(404).json({ msg: 'user not found, transaction cancelled' })];
            case 9: return [3 /*break*/, 12];
            case 10: return [4 /*yield*/, session.abortTransaction()];
            case 11:
                _a.sent();
                session.endSession();
                return [2 /*return*/, res.status(500).json({ msg: 'unable to transfer credit' })];
            case 12: return [3 /*break*/, 15];
            case 13: return [4 /*yield*/, session.abortTransaction()];
            case 14:
                _a.sent();
                session.endSession();
                return [2 /*return*/, res.status(500).json({ msg: 'please buy credit' })];
            case 15: return [3 /*break*/, 24];
            case 16:
                if (!(decoded && decoded.admin == true)) return [3 /*break*/, 23];
                return [4 /*yield*/, UserModel.startSession()];
            case 17:
                session = _a.sent();
                session.startTransaction();
                return [4 /*yield*/, UserModel.findOneAndUpdate({ user: customer }, { $inc: { credit: credit } }).session(session)];
            case 18:
                doc = _a.sent();
                if (!doc) return [3 /*break*/, 20];
                return [4 /*yield*/, session.commitTransaction()];
            case 19:
                _a.sent();
                session.endSession();
                return [2 /*return*/, res.status(200).json({ msg: 'credit transferred successfully' })];
            case 20: return [4 /*yield*/, session.abortTransaction()];
            case 21:
                _a.sent();
                session.endSession();
                return [2 /*return*/, res.status(404).json({ msg: 'user not found, transaction cancelled' })];
            case 22: return [3 /*break*/, 24];
            case 23: return [2 /*return*/, res.status(500).json({ msg: 'Internal server error' })];
            case 24: return [3 /*break*/, 26];
            case 25:
                err_5 = _a.sent();
                return [2 /*return*/, res.status(500).json({ msg: 'Internal server error' })];
            case 26: return [2 /*return*/];
        }
    });
}); });
// save otp
router.post('/otp/save', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _otp, _key, OTP;
    return __generator(this, function (_a) {
        _otp = req.body.otp;
        _key = req.body.key;
        if (!_otp || _otp == '' || !_key || _key == '')
            return [2 /*return*/, res.status(400).json({ msg: 'otp not found' })];
        try {
            OTP = new otp({
                otp: parseInt(_otp),
                key: _key,
                createdAt: new Date()
            });
            UserController_1.saveOTP(OTP).then(function (succ) {
                if (succ) {
                    return res.status(200).json({ msg: 'otp sent to verify' });
                }
                else {
                    return res.status(500).json({ msg: 'unable to send otp verify' });
                }
            }).catch(function (err) {
                console.log(err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            });
        }
        catch (error) {
            console.log(error);
            return [2 /*return*/, res.status(500).json({ msg: 'Internal Server Error', error: error })];
        }
        return [2 /*return*/];
    });
}); });
//fetch otp from swift
router.get('/otp/fetch', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _key;
    return __generator(this, function (_a) {
        _key = req.query.key;
        if (!_key || _key == '')
            return [2 /*return*/, res.status(400).json({ msg: 'key not found' })];
        try {
            UserController_1.fetchOTP(_key).then(function (succ) {
                if (succ) {
                    return res.status(200).json({ otp: succ });
                }
                else {
                    return res.status(500).json({ msg: 'unable to fetch otp, please enter manually' });
                }
            }).catch(function (err) {
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            });
        }
        catch (error) {
            return [2 /*return*/, res.status(500).json({ msg: 'Internal Server Error', error: error })];
        }
        return [2 /*return*/];
    });
}); });
//get all user registered by me
router.post('/getAll', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, page, limit, decoded;
    return __generator(this, function (_a) {
        token = req.headers['access-token'];
        page = req.query.page;
        limit = req.query.limit;
        if (!token || token == null || !page || page == '' || !limit || limit == '')
            return [2 /*return*/, res.status(400).json({ msg: 'You are not an Authorized user' })];
        try {
            decoded = UserController_1.verifyToken(token);
            if (decoded) {
                UserController_1.getAllUser(decoded.user, parseInt(page), parseInt(limit)).then(function (list) {
                    if (list)
                        return res.status(200).json(list);
                    else
                        return res.status(404).json({ msg: 'You did not registered any user yet' });
                }).catch(function (err) {
                    return res.status(500).json({ msg: 'Internal server error, please try again' });
                });
            }
        }
        catch (error) {
            return [2 /*return*/, res.status(500).json({ msg: 'Internal Server Error', error: error })];
        }
        return [2 /*return*/];
    });
}); });
// user registerby me count
router.get('/user/register/count', Auth_1.Auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, usr;
    return __generator(this, function (_a) {
        try {
            user = req.headers['access-token'];
            usr = UserController_1.verifyToken(user);
            if (usr) {
                UserController_1.getUsersCount(usr.user).then(function (count) {
                    if (count)
                        return res.status(200).json({ count: count });
                    else
                        return res.status(404).json({ msg: 'no users registered by you' });
                }).catch(function (err) {
                    console.log(err);
                    return res.status(500).json({ msg: 'Internal Server error' });
                });
            }
            else
                return [2 /*return*/, res.status(401).json({ msg: 'Token Verification error' })];
        }
        catch (err) {
            console.log(err);
            return [2 /*return*/, res.status(500).json({ msg: 'Internal Server Error' })];
        }
        return [2 /*return*/];
    });
}); });
router.post('/admin/key/resetAll', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded;
    return __generator(this, function (_a) {
        token = req.headers['access-token'];
        try {
            decoded = UserController_1.verifyToken(token);
            if (decoded) {
                UserController_1.resetAllKey(decoded.user).then(function (upd) {
                    if (upd)
                        return res.status(200).status(200).json({ msg: 'Alll key Reset successfully' });
                    else
                        return res.status(401).json({ msg: 'Unable to Reset key or Already Reset' });
                }).catch(function (err) {
                    console.log(err);
                    return res.status(500).json({ msg: 'Internal Server Error, Please Try Again' });
                });
            }
            else
                return [2 /*return*/, res.status(401).json({ msg: 'You are UnAuthorized, Try Login Again' })];
        }
        catch (err) {
            console.log(err);
            return [2 /*return*/, res.status(500).json({ msg: 'Internal Server Error, Please Try Again' })];
        }
        return [2 /*return*/];
    });
}); });
module.exports = router;
/*

let _key = generateKey(15)
                    let key = new KeyList({
                        key: _key,
                        keyname: _keyname,
                        user: user,
                        activated: false,
                        date: new Date(),
                        mac_id: ''
                    })
                    let searchKey = await KeyList.findOne({keyname: _keyname})
                    if(!searchKey) {
                        await key.save()
                        await session.commitTransaction()
                        session.endSession()
                        return res.status(200).json({key: _key})
                    }
                    else  {
                        await session.abortTransaction()
                        session.endTransaction()
                        return res.status(302).json({msg: 'key with this name already registered by you or someone'})
                    }



*/ 
