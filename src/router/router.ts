import express from 'express'
import { Auth, checkKeyActivation, checkKeyRegistration, checkSwiftKeyRegistration } from '../auth/Auth'
import {addAndActivateKey, addAndActivateSwiftKey, addCredit, addKey, addUser,  checkKeyValidity,  fetchOTP,  generateKey,  generateToken, getAllKey, getAllUser, getKeysCount, getuser, getUsersCount, login, resetAllKey, resetKey, resetPassword, saveOTP, updateCredit, verifyToken } from '../controller/UserController'
const KeyList = require('../model/keyList')
const KeyModel = require('../model/KeyModel.ts')
const UserModel = require('../model/UserModel.ts')
const SwiftKeyList = require('../model/SwiftKeyList')
const otp = require('../model/OTPModel')
let router = express.Router()




router.get('/user', Auth, async(req: express.Request, res: express.Response) => {
    try {
        let decoded = verifyToken(req.headers['access-token'] as string)
        if(decoded) {
            getuser(decoded.user).then((user) => {
                if(user) return res.status(200).json(user)
                else return res.status(401).json({msg: 'unAuthorized user'})
            }).catch((err) => {
                return res.status(500).json({msg: 'Internal Server Error', error: err})
            })
        }
        else return res.status(401).json({msg: 'UnAuthorized user'})
    }
    catch(err) {
        return res.status(500).json({msg: 'Internal Server Error', error: err})
    }
})





//Register user
router.post('/register', Auth, async(req: express.Request, res: express.Response) => { 
    let user = new UserModel({
        credit: req.body.credit,
        password: req.body.password,
        user: req.body.user,
        admin: false,
        registeredBy: 'dsewa'
    })
  try {  
    if(user.password == "" || user.password == null ||
    user.user == "" || user.user == null ||
    user.credit == '' || user.credit == null) return res.status(400).json({msg: 'please fill all details'})
    let token = req.headers['access-token'] as string
    let decoded = verifyToken(token)
    if(decoded) {
        const session = await UserModel.startSession()
        session.startTransaction()
        let usrFound = await UserModel.findOne({user: decoded.user}).session(session)
        if(usrFound && usrFound.credit >= user.credit && usrFound.admin == false) {
            let doc = await UserModel.findOne({user: user.user}).session(session)
            if(!doc) {
                let upadteCredit = await UserModel.findOneAndUpdate({user: decoded.user}, {$inc: {credit: -user.credit}}).session(session)
                if(upadteCredit) {
                    user.registeredBy = decoded.user
                    await user.save()
                    await session.commitTransaction()
                    session.endSession()
                    return res.status(200).json({msg: 'yeah user registered successfully'})
                }
                else {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(500).json({msg: 'unable to add user please try again'})
                }
            }
            else {
                await session.abortTransaction()
                session.endSession()
                return res.status(302).json({msg: 'user with this username already exists'})
            }
        }
        else if(usrFound && usrFound.admin == true) {
            let doc = await UserModel.findOne({user: user.user}).session(session)
            if(!doc) {
                user.registeredBy = decoded.user
                await user.save()
                await session.commitTransaction()
                session.endSession()
                return res.status(200).json({msg: 'yeah user registered successfully'})                
            }
            else {
                session.endSession()
                return res.status(302).json({msg: 'user with this username already exists'})
            }
        }
        else  {
            session.endSession()
            return res.status(401).json({msg: 'You dont have enough credit, please buy credit'})
        }
    }
    else return res.status(401).json({msg: 'UnAuthorized User'})
    
  }
  catch(err) {
      return res.status(500).json({msg: 'Internal Server Error', error: err})
  }    
})




//Generate key 
router.post('/admin/generate/key', Auth,  async(req: express.Request, res: express.Response) => {
    let token = req.headers['access-token'] as string
    let _keyname = req.body.keyname 
    if(!_keyname || _keyname == '' || _keyname.length > 10 || _keyname.length < 3) return res.status(400).json({msg: 'please give key name between 3 to 10 characters long only'})
    try {
        let verified = verifyToken(token)
        if(verified) {
            const session = await UserModel.startSession()
            session.startTransaction()
            let user = await UserModel.findOne({user: verified.user}).session(session)
            if(user && user.credit > 0 && user.admin == false)  {
                let doc = await UserModel.findOneAndUpdate({user: user.user}, {$inc: {credit: -1}}).session(session)
                if(doc) {
                    let _key = generateKey(15)
                    let key = new KeyList({
                        key: _key,
                        keyname: _keyname,
                        user: verified.user,
                        activated: false,
                        date: new Date(),
                        mac_id: ''
                    })  
                    let searchKey = await KeyList.findOne({keyname: _keyname})
                    if(!searchKey) {
                        key.save()
                        await session.commitTransaction()
                        session.endSession()
                        return res.status(200).json({key: _key})
                    } 
                    else  {
                        await session.abortTransaction()
                        session.endSession()
                        return res.status(302).json({msg: 'key with this name already registered by you or someone'})
                    }         
                }
                else {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(500).json({msg: 'unable to generate key'})                    
                }
            }
            else if(user && user.admin == true) {
                let _key = generateKey(15)
                let key = new KeyList({
                    key: _key,
                    keyname: _keyname,
                    user: verified.user,
                    activated: false,
                    date: new Date(),
                    mac_id: ''
                })   
                let searchKey = await KeyList.findOne({keyname: _keyname})
                if(!searchKey) {
                    key.save()
                    await session.commitTransaction()
                    session.endSession()
                    return res.status(200).json({key: _key})
                } 
                else  {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(302).json({msg: 'key with this name already registered by you or someone'})
                }
            }
            else {
                await session.abortTransaction()
                session.endSession()
                return res.status(500).json({msg: 'unable to generate key, please try again'})
            }

        }
        else return res.status(401).json({msg: 'UnAuthorized user'})
    }
    catch(err) {
        return res.status(500).json({msg: 'Internal Server Error', error: err})
    }
})





//generate swift keys
//Generate key 
router.post('/swift/generate/key', Auth,  async(req: express.Request, res: express.Response) => {
    let token = req.headers['access-token'] as string
    let _keyname = req.body.keyname 
    if(!_keyname || _keyname == '' || _keyname.length > 10 || _keyname.length < 3) return res.status(400).json({msg: 'please give key name between 3 to 10 characters long only'})
    try {
        let verified = verifyToken(token)
        if(verified) {
            const session = await UserModel.startSession()
            session.startTransaction()
            let user = await UserModel.findOne({user: verified.user}).session(session)
            if(user && user.credit > 0 && user.admin == false)  {
                let doc = await UserModel.findOneAndUpdate({user: user.user}, {$inc: {credit: -1}}).session(session)
                if(doc) {
                    let _key = generateKey(15)
                    let key = new SwiftKeyList({
                        key: _key,
                        keyname: _keyname,
                        user: verified.user,
                        activated: false,
                        date: new Date(),
                        mac_id: ''
                    })  
                    let searchKey = await SwiftKeyList.findOne({keyname: _keyname})
                    if(!searchKey) {
                        key.save()
                        await session.commitTransaction()
                        session.endSession()
                        return res.status(200).json({key: _key})
                    } 
                    else  {
                        await session.abortTransaction()
                        session.endSession()
                        return res.status(302).json({msg: 'key with this name already registered by you or someone'})
                    }         
                }
                else {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(500).json({msg: 'unable to generate key'})                    
                }
            }
            else if(user && user.admin == true) {
                let _key = generateKey(15)
                let key = new SwiftKeyList({
                    key: _key,
                    keyname: _keyname,
                    user: verified.user,
                    activated: false,
                    date: new Date(),
                    mac_id: ''
                })   
                let searchKey = await SwiftKeyList.findOne({keyname: _keyname})
                if(!searchKey) {
                    key.save()
                    await session.commitTransaction()
                    session.endSession()
                    return res.status(200).json({key: _key})
                } 
                else  {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(302).json({msg: 'key with this name already registered by you or someone'})
                }
            }
            else {
                await session.abortTransaction()
                session.endSession()
                return res.status(500).json({msg: 'unable to generate key, please try again'})
            }

        }
        else return res.status(401).json({msg: 'UnAuthorized user'})
    }
    catch(err) {
        return res.status(500).json({msg: 'Internal Server Error', error: err})
    }
})











router.get('/get/keys', async(req: express.Request, res: express.Response) => {
    let token = req.headers['access-token'] as string
    let page = req.query.page as string
    let limit = req.query.limit as string
    if(!token || token == '' || !page || page == '' || !limit || limit == '') return res.status(400).json({msg: 'please fill all details'})

    try {
        let decoded = verifyToken(token)
        if(decoded) {
            await getAllKey(decoded.user, parseInt(page), parseInt(limit)).then((list) => {
                if(list) return res.status(200).json(list)
                else return res.status(404).json({msg: 'No Key Found'})
            }).catch((err) => {
                return res.status(500).json(err)
            })
        }
        else return res.status(401).json({msg: 'please login again'})
    }
    catch(err) {
        return res.status(500).json(err)
    }
})





//login
router.post('/admin/login', async(req: express.Request, res: express.Response) => {
    if(req.body.user == "" || req.body.password == "") return res.status(400).json({msg: 'please enter user and password'})
    login(req.body.user as string, req.body.password as string).then((user) => {
        if(user && user.credit >= 0 && user.admin == false) {
            let token = generateToken({user:req.body.user, admin: false}, '1hr');
            user.password = null
            return res.status(200).json({user: user, token: token})
        }
        else if(user && user.credit >= 0 && user.admin == true) {
            let token = generateToken({user:req.body.user, admin: true}, '1hr')
            user.password = null
            return res.status(200).json({user: user, token: token})
        }
        else return res.status(404).json({msg: 'user does not exists'})
    }).catch((err) => {
        console.log(err)
        return res.status(500).json(err)
    })
})






//Activate generated key (its activated through SWIFT TATKAL EXTENSION ONLY)
router.get('/admin/activate/key', checkKeyRegistration, async (req: express.Request, res: express.Response) => {
    let key =  req.query.key as string
    let mac_id = req.query.mac_id as string
    console.log("Inside router => " + req.body)
    if(!key || key == "" || !mac_id || mac_id == "") return res.status(400).json({msg: 'please give key and mac_id'})
    try {
        addAndActivateKey(key, mac_id).then((result) => {
            if(result) {
                return res.status(200).json({'validity': result})
            }
            else return res.status(401).json({msg: 'Key Already Registered'})
        }).catch((err) => {
            return res.status(500).json({msg: 'Internal Server Error', error: err})
        })    
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({msg: 'Internal server error please try again or check your key', error: err})
    }
    
})




//swift key activation
//Activate generated key (its activated through SWIFT TATKAL EXTENSION ONLY)
router.get('/swift/activate/key', checkSwiftKeyRegistration, async (req: express.Request, res: express.Response) => {
    let key =  req.query.key as string
    let mac_id = req.query.mac_id as string
    if(!key || key == "" || !mac_id || mac_id == "") return res.status(400).json({msg: 'please give key and mac_id'})
    try {
        addAndActivateSwiftKey(key, mac_id).then((result) => {
            if(result) {
                return res.status(200).json({'validity': result})
            }
            else return res.status(401).json({msg: 'Key Already Registered'})
        }).catch((err) => {
            return res.status(500).json({msg: 'Internal Server Error', error: err})
        })    
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({msg: 'Internal server error please try again or check your key', error: err})
    }
    
})





//Reset key can only be done by admin
router.post('/admin/reset/key', async (req: express.Request, res: express.Response) => {
    let token = req.headers['access-token'] as string
    let keyname = req.query.key as string
    let kiska = req.query.kiska as string
    if(!token || token == '' || !keyname || keyname == '') return res.status(400).json('please provide keyname')
    try {
        let decoded = verifyToken(token)
        if(decoded) {   // && decoded.admin == true
            if(kiska == 'swift') {
                await resetKey(keyname, decoded.user, 'swift').then((succ) => {
                    if(succ) return res.status(200).json({msg: 'succesfully reset'})
                    else return res.status(401).json({msg: 'key or user is not valid'})
                }).catch((err) => {
                    return res.status(500).json({msg: 'unable to reset please try again'})
                })
            }
            else {
                await resetKey(keyname, decoded.user).then((succ) => {
                    if(succ) return res.status(200).json({msg: 'succesfully reset'})
                    else return res.status(401).json({msg: 'key or user is not valid'})
                }).catch((err) => {
                    return res.status(500).json({msg: 'unable to reset please try again'})
                })                
            }
        }
        else return res.status(401).json({msg: 'you can not reset key'})
    }
    catch(err) {
        return res.status(500).json(err)
    }
})








router.get('/check', async (req: express.Request, res: express.Response) => {
    let key = req.query.key as string
    if(!key || key == "") return res.status(400).json({msg: 'key not found'})
    try {
        checkKeyValidity(key).then((val) => {
            if(val) res.status(200).json({'validity': val})
            else res.status(401).json({msg: 'validity expired'})
        })        
    }
    catch(err) {
        return res.status(500).json(err)
    }
})






//check user auth
router.post('/verify', async(req: express.Request, res: express.Response) => {
    let token = req.headers['access-token'] as string
    if(!token || token == '') return res.status(401).json({msg: 'please login again'})
    try {
        let verify = verifyToken(token)
        if(verify) return res.status(200).json({msg: 'verified'})
        else return res.status(401).json({msg: 'please login again'})
    } catch (error) {
        return res.status(500).json(error)
    }
})


//get keys count of a particular user
router.get('/admin/key/count', Auth, async(req: express.Request, res: express.Response) => {
    try {
        let usr = verifyToken(req.headers['access-token'] as string)
        if(usr) {
            getKeysCount(usr.user).then((count) => {
                if(count) return res.status(200).json({count: count})
                else return res.status(404).json({msg: 'no keys found'})
            }).catch((err) => {
                return res.status(500).json({msg: 'Internal Server Error', error: err})
            })
        }        
    }
    catch(err) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})





//admin can only reset password
router.post('/user/password/reset', async(req: express.Request, res: express.Response) => {
    try {
        let token = req.headers['access-token'] as string
        let user = req.body.user
        let password = req.body.password
        if(!token || token == '' || !user || user == '' || !password || password == '') return res.status(400).json({msg: 'please provide all details or you are not an Admin'}) 
        let decoded = verifyToken(token)
        if(decoded && decoded.admin == true) {
            resetPassword(user, password).then((succ) => {
                if(succ) return res.status(200).json({msg: 'password reset successfully'})
                else return res.status(404).json({msg: 'unable to reset password'})
            }).catch((err) => {
                return res.status(500).json({msg: 'Internal server error'})
            })
        }
        else return res.status(401).json({msg: 'You are not an Admin'})
    } catch (error) {
        return res.status(500).json(error)
    }
})








//sell credit to others
router.post('/sell/credit', async(req: express.Request, res: express.Response) => {
    let customer = req.body.user
    let credit = parseInt(req.body.credit)
    let token = req.headers['access-token'] as string
    if(!customer || customer == '' || !credit || credit == 0 || !token || token == '') return res.status(400).json({msg: 'please fill all details'})
    try {
        let decoded = verifyToken(token)
        if(decoded && decoded.admin == false) {
            const session = await UserModel.startSession()
            session.startTransaction()
            let usr = await UserModel.findOne({user: decoded.user}).session(session)
            if(usr.credit > 0) {
                let doc1 = await UserModel.findOneAndUpdate({user: decoded.user}, {$inc: {credit: -credit}}).session(session)
                if(doc1) {
                    let doc2 = await UserModel.findOneAndUpdate({user: customer}, {$inc: {credit: credit}}).session(session)
                    if(doc2) {
                        await session.commitTransaction()
                        session.endSession()
                        return res.status(200).json({msg: 'credit transferred successfully'})
                    }
                    else {
                        await session.abortTransaction()
                        session.endSession()
                        return res.status(404).json({msg: 'user not found, transaction cancelled'})
                    }
                }
                else {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(500).json({msg: 'unable to transfer credit'})
                }                
            }
            else {
                await session.abortTransaction()
                session.endSession()
                return res.status(500).json({msg: 'please buy credit'})
            }
        }
        else if(decoded && decoded.admin == true) {
            const session = await UserModel.startSession()
            session.startTransaction()
            let doc = await UserModel.findOneAndUpdate({user: customer}, {$inc: {credit: credit}}).session(session)
                if(doc) {
                    await session.commitTransaction()
                    session.endSession()
                    return res.status(200).json({msg: 'credit transferred successfully'})
                }
                else {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(404).json({msg: 'user not found, transaction cancelled'})
                }
        }
        else return res.status(500).json({msg: 'Internal server error'})
    }
    catch(err) {
         return res.status(500).json({msg: 'Internal server error'})
    }
})




// save otp
router.post('/otp/save',  async(req: express.Request, res: express.Response) => {
    let _otp = req.body.otp
    let _key = req.body.key
    if(!_otp || _otp == ''|| !_key || _key == '') return res.status(400).json({msg: 'otp not found'})
    try {
        let OTP = new otp({
            otp: parseInt(_otp),
            key: _key,
            createdAt: new Date()
        })
        saveOTP(OTP).then((succ) => {
            if(succ) {
                return res.status(200).json({msg: 'otp sent to verify'})
            }
            else  {
                return res.status(500).json({msg: 'unable to send otp verify'})
            }
        }).catch((err) => {
            console.log(err)
            return res.status(500).json({msg: 'Internal Server Error', error: err})
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'Internal Server Error', error: error})
    }
})




//fetch otp from swift
router.get ('/otp/fetch',  async(req: express.Request, res: express.Response) => {
    let _key = req.query.key as string
    if(!_key || _key == '') return res.status(400).json({msg: 'key not found'})
    try {
        fetchOTP(_key).then((succ) => {
            if(succ) {
                return res.status(200).json({otp: succ})
            }
            else  {
                return res.status(500).json({msg: 'unable to fetch otp, please enter manually'})
            }
        }).catch((err) => {
            return res.status(500).json({msg: 'Internal Server Error', error: err})
        })
    } catch (error) {
        return res.status(500).json({msg: 'Internal Server Error', error: error})
    }
})





//get all user registered by me
router.post('/getAll',  async(req: express.Request, res: express.Response) => {
    let token = req.headers['access-token'] as string
    let page = req.query.page as string
    let limit = req.query.limit as string
    if(!token || token == null || !page || page == '' || !limit || limit == '') return res.status(400).json({msg: 'You are not an Authorized user'})
    try {
        let decoded = verifyToken(token)
        if(decoded) {
            getAllUser(decoded.user, parseInt(page), parseInt(limit)).then((list) => {
                if(list) return res.status(200).json(list)
                else return res.status(404).json({msg: 'You did not registered any user yet'})
            }).catch((err) => {
                return res .status(500).json({msg: 'Internal server error, please try again'})
            })
        }
    } catch (error) {
        return res.status(500).json({msg: 'Internal Server Error', error: error})
    }
})




// user registerby me count
router.get('/user/register/count', Auth, async(req: express.Request, res: express.Response) => {
    try {
        let user = req.headers['access-token'] as string
        let usr = verifyToken(user)
        if(usr) { 
            getUsersCount(usr.user).then((count) => {
                if(count) return res.status(200).json({count: count})
                else return res.status(404).json({msg: 'no users registered by you'})
            }).catch((err) => {
                console.log(err)
                return res.status(500).json({msg: 'Internal Server error'})
            })
        } 
        else return res.status(401).json({msg: 'Token Verification error'})       
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})





router.post('/admin/key/resetAll', async(req: express.Request, res: express.Response) => {
    let token = req.headers['access-token'] as string
    let kiska = req.query.kiska as string
    try {
        let decoded = verifyToken(token)
        if(decoded) {
            if(kiska && kiska == 'swift') {
                resetAllKey(decoded.user, 'swift').then((upd) => {
                    if(upd) return res.status(200).status(200).json({msg: 'Alll key Reset successfully'})
                    else return res.status(401).json({msg: 'Unable to Reset key or Already Reset'})
                }).catch((err) => {
                    console.log(err)
                    return res.status(500).json({msg: 'Internal Server Error, Please Try Again'})
                })
            }
            else {
                resetAllKey(decoded.user).then((upd) => {
                    if(upd) return res.status(200).status(200).json({msg: 'All key Reset successfully'})
                    else return res.status(401).json({msg: 'Unable to Reset key or Already Reset'})
                }).catch((err) => {
                    console.log(err)
                    return res.status(500).json({msg: 'Internal Server Error, Please Try Again'})
                })                
            }
        }
        else return res.status(401).json({msg: 'You are UnAuthorized, Try Login Again'})
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({msg: 'Internal Server Error, Please Try Again'})
    }
})






module.exports = router





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