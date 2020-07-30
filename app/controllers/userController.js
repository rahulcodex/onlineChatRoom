const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const passwordCompare  = require('../libs/generatePasswordLib')
const tokenLib = require('./../libs/tokenLib')

/* Models */
const UserModel = mongoose.model('User')




// start user signup function 

let signUpFunction = (req, res) => {

    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, 'not valid email ', 400, null)
                    reject(apiResponse)
                }
                else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, ' password is missing', 400, null)
                    reject(apiResponse)
                }
                else if (!validateInput.password(req.body.password)) {
                    let apiResponse = response.generate(true, 'password isnot valid', 400, null)
                    reject(apiResponse)
                }

                else {
                    resolve(req)
                }
            }
            else {
                logger.error(err.message, 'userController:validateUser', 10)
                let apiResponse = response.generate(true, 'one or more field is missing', 403, null)
            }
        })
    }


    let createUser = () => {
        return new promise((resolve, reject) => {

            UserModel.findOne({ email: req.body.email }, (err, retrieveUserDetails) => {
                if (err) {
                    logger.error(err.message, 'userController:createUser', 5)
                    let apiResponse = response.generate(true, 'error occured', 500, null)
                    reject(apiResponse)
                }

                else if (check.isEmpty(retrieveUserDetails)) {

                    let newData = new UserModel({
                        userid: shortid.generate(),
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        password: req.body.password,
                        email: req.body.email,
                        mobileNumber: req.body.mobileNumber,
                        createdOn: time.now()
                    })

                    newData.save((err, newdata) => {
                        if (err) {
                            logger.error(err.message, 'userController:createUser', 5)
                            let apiResponse = response.generate(true, ' some error occured', 500, null)
                            reject(apiResponse)
                        }

                        else {
                            let newDataObj = newData.toObject();
                            resolve(newDataObj)
                        }
                    })
                }

                else {
                    logger.error('user can not e created already present', 'userController:createUser', 5)
                    let apiResponse = response.generate(true, 'user already present with this email', 403, null)
                    reject(apiResponse)
                }
            })
        })

    }
    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password
            let apiResponse = response.generate(false, 'usder created ', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })


}// end user signup function 

// start of login function 
let loginFunction = (req, res) => {

    let findUser = () => {
        return new promise((resolve, reject) => {
            if (req.body.email) {
                UserModel.findOne({ email: req.body.email }, (err, userData) => {
                    if (err) {
                        logger.error(err.messgae, 'userController:findUser', 10)
                        let apiResponse = response.generate(true, 'some error occured', 400, null)
                        reject(apiResponse)
                    }
                    else if (check.isEmpty(userData)) {
                        logger.error('no user found with this email', 'useController:login', 10)
                        let apiResponse =response.generate(true, 'no user found', 404,null)
                        reject(apiResponse)
                    }
                    else{
                        logger.info('user found', 'userController:login', 5)
                        resolve(userData)
                    }
                })
            }

            else{
                let apiResponse = response.generate(true, 'some parametre is missing', 403, null)
                reject(apiResponse)
            }
        })
    }


    let validatePassword=(userData)=>{

    return new promise((resolve, reject)=>{
           passwordCompare.comparePassword(req.body.password, userData.password ,(err, isMatch)=>{
               if(err)
               {
                   logger.error(err.message, 'userController:validatePassword', 10)
                   let apiResponse = response.generate(true, 'login failed', 403, null)
                   reject(apiResponse)
               }
               else if(isMatch){
                let   userDataObj =  userData.toObject()
                delete userDataObj.password
                delete userDataObj._id
                delete userDataObj._v
                delete userDataObj.createdOn
                resolve(userDataObj)
               }

               else{
                logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                reject(apiResponse)
               }
           })
    })

    }


    let generateToken =(userData)=>{
            tokenLib.generateToken(userData, (err, tokenDetails)=>{
                if(err)
                {
                    logger.error(err.message, 'userController:generateToken', 10)
                    let apiResponse = response.generate(true, 'error occured', 400, null)
                    reject(apiResponse)
                }
                else{
                    tokenDetails.userid = userData.userid
                    tokenDetails.userData = userData
                    resove(tokenDetails)
                }
            })
    }

    findUser(req, res)
    .then(validatePassword)
    .then(generateToken)
    .then((resolve)=>{
        let apiResponse = response.generate(false, 'login Succesfull', 200, esolve)
        res.status(200)
        res.send(apiResponse)
    })
    .then((err)=>{
        console.log('failsed to login')
        console.log(err)
        res.status(err)
        res.send(err)
        
    })

}


// end of the login function 
let logout = (req, res) => {
    AuthModel.findOneAndRemove({userId: req.user.userId}, (err, result) => {
      if (err) {
          console.log(err)
          logger.error(err.message, 'user Controller: logout', 10)
          let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
          res.send(apiResponse)
      } else if (check.isEmpty(result)) {
          let apiResponse = response.generate(true, 'Already Logged Out or Invalid UserId', 404, null)
          res.send(apiResponse)
      } else {
          let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
          res.send(apiResponse)
      }
    })
  } // end of the logout function.





let forgotPassword=(req, res)=>{
UserModel.findOne({email:req.body.email} , (err, data)=>{
    if(err)
    {
        logger.error(err.message, 'usercontrller:forgotPassword' , 10 )
        let apiResponse = response.generate(true, 'error occured',403,null)
        res.send(apiResponse)
    }
    else if(check.isEmpty(data))
       {
           logger.error('email not found' , 'userController:forgotPassword', 10)
           let apiResponse = response.generate(true, 'email not found', 404,null)
           res.send(apiResponse)
       }
       else{
           let apiResponse = response.generate(flase, 'email found ', 200, data)
           res.send(data.password)
       }
})
}


module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    forgotPassword:forgotPassword,
    logout: logout

}// end exports