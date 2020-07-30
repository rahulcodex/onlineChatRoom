const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')


const chatRoomModel = mongoose.model('chatroom');

let createChatRoom = (req, res) => {
    if (check.isEmpty(req.body.chatRoomId) || check.isEmpty(req.body.createdOn) || check.isEmpty(req.body.createdBy)) {
        logger.error('some parameter is missing', 'chatRoomController:createChatRoom', 5)
        let apiResponse = response.generate(true, 'some paramete missing', 403, null)
        res.send(apiResponse)
    }

    else {

        let newRoom = new chatRoomModel({
            chatRoomId :shortid.generate(),
            createdOn : time.now(),
            createdBy: req.body.createdBy
        })

        newRoom.save((err, result) => {
            if (err) {
                console.log("error occured")
                logger.error(`error cooured ${err}`, Database, 10)
                let apiResponse = response.generate(true, 'error occured', 500, null)
                res.send(apiResponse)
            }
            else {
                console.log("room created succesfully")
                res.send(result)
            }
        })
    }

}


let editChatRoom = (req, res) => {
    if(check.isEmpty(req.params.chatRoomId)){
        console.log('Id sholud be passed')
        let apiResponse = response.generate(true, 'productId is missing', 403,null)
        res.send(apiResponse)
    }
    else{

    
    let  Options = req.body;
    chatRoomModel.update({ chatRoomId: req.params.chatRoomId },Options, {multi:true}, (err, result) => {
        if (err) {
            logger.error(err.message, 'chatRoomController:editRoom', 10)
            let apiResponse = response(true, 'some error occured', 400, null)
            res.send(apiResponse)
        }
        else if (check.isEmpty(result)) {
            logger.info('no result found', 'chatRoomController:editRoom', 10)
            let apiResponse = response.generate(true, 'no result found', 404, null)
            res.send(apiResponse)
        }
        else {
            let apiResponse = response.generate(false, 'ChatRoom found succesfully', 200, result)
            res.send(apiResponse)
        }
    })
}

}


let deleteChatRoom = (req, res) => {

    if(check.isEmpty(req.params.chatRoomId)){
        console.log('Id sholud be passed')
        let apiResponse = response.generate(true, 'productId is missing', 403,null)
        res.send(apiResponse)
    }

    chatRoomModel.remove({ chatRoomId: req.params.chatRoomId }, (err, result) => {
        if (err) {
            logger.error(err.message, 'chatRoomController:deleteRoom', 10)
            let apiResponse = response.generate(true, 'some error occured', 400, null)
            res.send(apiResponse)
        }
        else if (check.isEmpty(result)) {
            logger.error('not found', 'chatRoomController:deleteRoom', 10)
            let apiResponse = response.generate(true, 'data not found', 404, null)
            res.send(apiResponse)
        }

        else {
            let apiResponse = response.generate(false, 'data deleted succesfully', 200, result)
            res.send(apiResponse)
        }
    })

}
let listAllRoom =(req, res)=>{
    chatRoomModel.find()
    .select('-_v -_id')
    .lean()
    .select()
    .exec((err, result)=>{
        if(err)
        {
            console.log(err);
            logger.error(err.message , "eController : getAllProducts", 10)
            let apiResponse = response.generate(true, " failed to find product  chat room", 500, null)
             res.send(apiResponse)
        }
        else if(check.isEmpty(result)){
            console.log('no room found')
           logger.info("no room found", "eController:getallProducts")
           let apiResponse = response.generate(true, "no  room found", 404,null)
           res.send(apiResponse)
        }
        else{
            let apiResponse = response.generate(false , " chat room  available", 200, result)
            res.send(apiResponse)
        }
    })
}


module.exports={
    createChatRoom:createChatRoom,
    deleteChatRoom:deleteChatRoom,
    editChatRoom:editChatRoom,
    listAllRoom:listAllRoom
    

}