const jwt = require('jsonwebtoken')
const shortId = require('shortid')
const secretKey = 'someVeryRandomStringThatNobodyCanGuess';


let generateToken =(data,cb)=>{


    try{
        let claims={
            jwtid :shortId.generate(),
            iat:Date.now(),
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            sub: 'authToken',
            iss: 'edChat',
            data: data
        }

        let tokenDetails ={
            token:jwt.sign(claims, secretKey),
            secretKey:secretKey
        }
        cb(null, tokenDetails)
    }
    catch(err){
              console.log(err)
              cb(err,null)
    }

}

let verifyClaim =(token, cb)=>{
    jwt.verify(token, secretKey, function (err,decode) {
         if(err)
         {
             console.log('error while verfying Token')
             console.log(err)
             cb(err, null)
         }
         else{
             console.log('user verified')
             console.log(decoded)
             cb(null, decoded)
         }
    });
}


let verifyClaimWithoutSecret = (token,cb) => {
    // verify a token symmetric
    jwt.verify(token, secretKey, function (err, decoded) {
      if(err){
        console.log("error while verify token");
        console.log(err);
        cb(err,data)
      }
      else{
        console.log("user verified");
        cb (null,decoded)
      }  
   
   
    });
  
  
  }// end verify claim

module.exports={
    generateToken:generateToken,
    verifyToken:verifyClaim,
    verify:verifyClaimWithoutSecret
}