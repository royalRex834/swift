const KeyModel = require('../model/KeyModel.ts')
const UserModel = require('../model/UserModel.ts')
const KeyList = require('../model/keyList')
const SwiftKeyList = require('../model/SwiftKeyList')
const otp = require('../model/OTPModel')
const jwt = require('jsonwebtoken')
const privateKey = "-----BEGIN RSA PRIVATE KEY-----MIICXgIBAAKBgQDVQVhEkxNxIliPJs1nYA+L7Kk+NWxhfIJJ9LmmKz6OfRcFl5UCcpt5lFWwOi0Ekq5R2t7VZ36jWGkNbiy7nL76VgMy/lk49if5KKTqVbTjSTkcsGPS/zgv/b8dFSat/D+knuBYXBEcXZX9I8IETHULZDIId/dp239OzK5F5bro6wIDAQABAoGBAK7p6/ZDFD1FSJIR54QU3GuOb7qgowbK0yrJ2cQb0DGbFFj33bamPjPYoPfsn6QSk3x8Iy2yt8JO78ueRH6VsGWw6hSeoBha8zkyY6YKm1qrpXdO0wWVSomjYD9qE2yLNOeUzKiPKp2nVZjENuS/SuPduEYHJ7vl20fnhhaKXebBAkEA7qNCmwZ9uCGPNjyg9hSzBX6gZP7hiGPp7iqZAQ1LLwDZ52THkQ/jnGPw78i/gKFV1xMSAe6Z3IEHPAdT/GIPMQJBAOTFUvA/8ZYTMg6KMW+yc37xpieqOabVf3op/GoJwK92sIjFhQ8mTsHihiafF5mMAowjpAHI1DLP/9RTje1ACtsCQQCezY4ZU+x9h/ehhB8pIwUu9uEN1H+JH9QgZcCD7rDFiq93SJ11bzlsbSV8q/6kPri88zfciUdicYq667V8ElVBAkAjC/fAxosEKryobZNVQUlgUTTbLsDWRi7ZUEVTGVtjhhNVYK0ZvQyjt0hF8mlzJHffcDZX76RShHr01DgR+JWxAkEAhcQNmEqy52iwsXkbhSjLc+4ZDIILEot6ImhRlryb96DkB6cMJYN0CQUEP4tGc2Z5fG6jLkvcOuh0U1Si4m3gaA==-----END RSA PRIVATE KEY-----"
const publicKey = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDVQVhEkxNxIliPJs1nYA+L7Kk+NWxhfIJJ9LmmKz6OfRcFl5UCcpt5lFWwOi0Ekq5R2t7VZ36jWGkNbiy7nL76VgMy/lk49if5KKTqVbTjSTkcsGPS/zgv/b8dFSat/D+knuBYXBEcXZX9I8IETHULZDIId/dp239OzK5F5bro6wIDAQAB-----END PUBLIC KEY-----"


//Admin/SubAdmin panel login
export async function addUser(model: typeof UserModel) : Promise<any> {
    try {
        let user = await UserModel.findOne({user: model.user})
        if(!user) {
            model.save()
            return model.user
        }
        return null        
    }
    catch(err) {
        throw err
    }
}




//Get All Key
export async function getAllKey(user: string, page: number, limit: number): Promise<any> {
    try {
        let offset = ((page * limit) - limit)
        let keys = await KeyList.find({user: user}).sort({date: -1}).skip(offset).limit(limit)
        if(keys) {
            return keys
        }
        else return null        
    }
    catch(err) {
        throw err
    }
}





//add key in seperate collection to check wheteher user is entering the same key when he generated
export async function addKey(_key: string, _keyname: string, user: string): Promise<any> {
    try {
        let found = await KeyList.findOne({keyname: _keyname})
        if(!found) {
            let key = new KeyList({
                key: _key,
                keyname: _keyname,
                user: user,
                activated: false,
                date: new Date(),
                mac_id: ''
            })
            key.save()
            return key
        }
        return null        
    }
    catch(err) {
        throw err
    }
}






export async function addAndActivateKey(key: string, mac_id: string): Promise<any> {
    try {
        let keymodel = await KeyList.findOne({key: key})
        if(keymodel && keymodel.activated == false && keymodel.mac_id != mac_id) {
            let filter = {key: key}
            let update = {mac_id: mac_id, activated: true}
            let currdate = new Date().getTime()
            let olddate = new Date(keymodel.date).getTime()
            let diff = Math.abs(currdate - <any>olddate)
            if((30 - (diff/86400000)) < 1) return null
            else {
                let doc = await KeyList.findOneAndUpdate(filter, update, {
                    returnOriginal: false
                })
                if(doc) {
                    return Math.floor(30 - (diff/86400000))
                }
            }
        }
        else if(keymodel && keymodel.activated == true && keymodel.mac_id == mac_id) {
            console.log({key: key, mac: mac_id})
            console.log({key: keymodel.key, mac: keymodel.mac_id})
            let currdate = new Date().getTime()
            let olddate = new Date(keymodel.date).getTime()
            let diff = Math.abs(currdate - <any>olddate )
            if((30 - (diff/86400000)) < 1) return null
            else return Math.floor(30 - (diff/86400000))
        }
        else return null        
    }
    catch(err) {
        throw err
    }
}





//add and activate swift key
export async function addAndActivateSwiftKey(key: string, mac_id: string): Promise<any> {
    try {
        let keymodel = await SwiftKeyList.findOne({key: key})
        if(keymodel && keymodel.activated == false && keymodel.mac_id != mac_id) {
            let filter = {key: key}
            let update = {mac_id: mac_id, activated: true}
            let currdate = new Date().getTime()
            let olddate = new Date(keymodel.date).getTime()
            let diff = Math.abs(currdate - <any>olddate)
            if((30 - (diff/86400000)) < 1) return null
            else {
                let doc = await SwiftKeyList.findOneAndUpdate(filter, update, {
                    returnOriginal: false
                })
                if(doc) {
                    return Math.floor(30 - (diff/86400000))
                }
            }
        }
        else if(keymodel && keymodel.activated == true && keymodel.mac_id == mac_id) {
            console.log({key: key, mac: mac_id})
            console.log({key: keymodel.key, mac: keymodel.mac_id})
            let currdate = new Date().getTime()
            let olddate = new Date(keymodel.date).getTime()
            let diff = Math.abs(currdate - <any>olddate )
            if((30 - (diff/86400000)) < 1) return null
            else return Math.floor(30 - (diff/86400000))
        }
        else return null        
    }
    catch(err) {
        throw err
    }
}





//Admin panel login
export async function login(id: string, password: string): Promise<any> {
    try {
        let user = await UserModel.findOne({user: id})
        if(user != null) {
            if(user.password == password) return user
            else return null
        }
        return null        
    }
    catch(err) {
        throw err
    }
}



//Activate key
export async function keyActivation(key: string): Promise<boolean> {
    let user = await UserModel.findOne({key: key})
    if(user != null) return true
    else return false
}




//update user credit
export async function updateCredit(user: string, reduce): Promise<any> {
    try {
        let usr = await UserModel.findOne({user: user})
        if(usr != undefined && usr.credit > 0) {
            let cred = parseInt(usr.credit) - reduce
            let filter = {user: usr.user}
            let update = {credit: cred}
            let doc = await UserModel.findOneAndUpdate(filter, update, {
                returnOriginal: false
            })
            return doc.credit
        }
        else return null        
    }
    catch(err) {
        throw err
    }
}




export function generateKey(length): string {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}




//generate token
export function generateToken(data, time): string {
    try {
        const fs = require('fs')
        let privateKey = fs.readFileSync("src/controller/private.key", 'utf8')
        let payload =  {
            user: data.user,
            admin: data.admin
        }
        let token = jwt.sign(payload, privateKey, {expiresIn: time, algorithm: 'RS256'})
        return token        
    } catch (error) {
        throw error
    }
}



//verify token 
export function verifyToken(token):any {
    const fs = require('fs')
    let publicKey = fs.readFileSync("src/controller/public.key", 'utf8')
    let verified = ''
    jwt.verify(token, publicKey, (err, decoded) => {
        if(err) verified = null
        else verified = decoded
    })
    return verified
}


//reset key only admin can do it
export async function resetKey(keyname: string, user: string, kiska? : string): Promise<boolean> {
    try {
        if(kiska == 'swift') {
            let keyFound = await SwiftKeyList.findOne({keyname: keyname})
            if(keyFound && keyFound.user == user) {
                let filter = {keyname: keyname}
                let update = {mac_id: "", activated: false}
                let doc = await SwiftKeyList.findOneAndUpdate(filter, update, {
                    returnOriginal: false
                })
                if(doc) return true
                else return null
            }            
        }
        else if(!kiska || kiska == '') {
            let keyFound = await KeyList.findOne({keyname: keyname})
            if(keyFound && keyFound.user == user) {
                let filter = {keyname: keyname}
                let update = {mac_id: "", activated: false}
                let doc = await KeyList.findOneAndUpdate(filter, update, {
                    returnOriginal: false
                })
                if(doc) return true
                else return null
            }
        }
        return null        
    } catch (error) {
        throw error
    }
}






//Reset All key
export async function resetAllKey(user: string, kiska ? : string): Promise<any> {
    try {
        if(kiska == 'swift') {
            let usr = await SwiftKeyList.find({user: user})
            if(usr) {
                let filter = {user: user}
                let update = {mac_id: "", activated: false}
                let doc = await SwiftKeyList.updateMany(filter, update)
                if(doc.nModified > 0) {
                    return true
                }
                else return false
            }
            else return false            
        }
        else {
            let usr = await KeyList.find({user: user})
            if(usr) {
                let filter = {user: user}
                let update = {mac_id: "", activated: false}
                let doc = await KeyList.updateMany(filter, update)
                if(doc.nModified > 0) {
                    return true
                }
                else return false
            }
            else return false            
        }
    }
    catch(err) {
        throw err
    }
}








//get keys count
export async function getKeysCount(user: string): Promise<any> {
    try {
        let keys = await KeyList.find({user: user})
        if(keys) {
            return keys.length
        }
        else return null        
    } catch (error) {
        throw error
    }
}


// get registered by me count
export async function getUsersCount(user: string): Promise<any> {
    try {
        let users = await UserModel.find({registeredBy: user})
        if(users) {
            return users.length
        }
        else return null        
    } catch (error) {
        throw error
    }
}



export async function getuser(user: string): Promise<any> {
    try {
        let usr = await UserModel.findOne({user: user})
        if(usr) return usr
        else return null
    } catch (error) {
        throw error
    }
}



//reset user password
export async function resetPassword(user: string, password: string): Promise<any> {
    try {
        let filter = {user: user}
        let update = {password: password}
        let doc = await UserModel.findOneAndUpdate(filter, update, {
            returnOriginal: false
        })
        if(doc) {
            return true
        }
        else return false        
    } catch (error) {
        throw error
    }
}






export async function checkKeyValidity(_key: string): Promise<any> {
    try {
        let key = await KeyList.findOne({key: _key})
        if(key) {
            let currdate = new Date().getTime()
            let olddate = new Date(key.date).getTime()
            let diff = Math.abs(currdate - <any>olddate)
            console.log((diff/86400000))
            if((diff/86400000) <= 30 && (diff/86400000) > 0) return Math.floor(30 - (diff/86400000))
            else return null
        }
        else return null
    }
    catch(err) {
        throw err
    }
}



export async function addCredit(user: string, cred: number) {
    try {
        let usr = await UserModel.findOne({user: user})
        if(usr) {
            let temp = parseInt(usr.credit) + cred
            let filter = {user: user}
            let update = {credit: cred}
            let doc = UserModel.findOneAndUpdate(filter, update, {
                returnOriginal: false
            })
            if(doc) return doc.credit
            else return null
        }
        else return null
    }
    catch(err) {
        throw err
    }
}




//on key generation deduct one credit
//activate key in activation (fetch mac_id and store in user mac field)




//OTP Receiver and sender
export async function saveOTP(model: typeof otp): Promise<any> {
    try {
        const session = await otp.startSession()
        session.startTransaction()
        let doc = await otp.find({key: model.key}).session(session)
        if(doc) {
            await otp.deleteMany({key: model.key})
            await model.save()
            await session.commitTransaction()
            session.endSession()
            return true
        }
        else {
            await model.save()
            await session.commitTransaction()
            session.endSession()
            return true
        }
    }
    catch(err) {
        throw err
    }
}


//fetch otp in swift app
export async function fetchOTP(key: string): Promise<any> {
    try {
        let findOtp = await otp.findOne({key: key})
        if(findOtp) {
            return findOtp.otp
        }
        else return null
    } catch (error) {
        throw error
    }
}




//get All user by me
export async function getAllUser(usr: string, page: number, limit: number): Promise<any> {
    try {
        let offset = ((page * limit) - limit)
        let user = await UserModel.find({registeredBy: usr}).sort({date: -1}).skip(offset).limit(limit).select({"user":1, "registeredBy":1, "credit": 1, "date": 1})
        if(user) {
            return user
        }
        else return null        
    }
    catch(err) {
        throw err
    }
}