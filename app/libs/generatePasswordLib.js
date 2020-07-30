const bcrypt = require('bcrypt')
const saltRounds = 10;

const logger = require('./../libs/loggerLib')

let hashPassword=(plainTextPassword)=>{
  let salt = bcrypt.genSaltSync(saltRounds)
  let hash = bcrypt.hashSync(plainTextPassword,salt)
  return hash

}

 let comparePassword=(oldPassword, hashPassword, cb)=>{
       bcrypt.compare(oldPassword, hashPassword ,(err, res)=>{
           if(err)
           {
               logger.error(err.message , 'comparison error', 10)
               cb(err, null)
           }
           else{

            cb(null, res)
           }
       })

 }
module.exports={
    hashPassword:hashPassword,
    comparePassword:comparePassword

}