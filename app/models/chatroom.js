
const mongoose = require('mongoose'),
 Schema = mongoose.Schema;
 let  chatroomScheama =  new Schema({

    chatRoomId:{
        type:String,
        unique:true,
        default:''
    },
    title:{
     type:String,
     default:''
    },
    createdOn:{
          type:String,
          default:''
    },
    createdBy:{
            type:String,
            default:String
    }

 })

 mongoose.model('chatroom', chatroomScheama);