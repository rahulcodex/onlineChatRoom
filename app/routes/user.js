const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const  ChatRoomController = require('./../../app/controllers/chatRoomController');
const appConfig = require("./../../config/appConfig");

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;
    let baseurl = `${appConfig.apiVersion}/chatRoom`;


    // defining routes.


    // params: firstName, lastName, email, mobileNumber, password
    app.post(`${baseUrl}/signup`, userController.signUpFunction);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login api for user login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Login Successful",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "userDetails": {
                "mobileNumber": 2234435524,
                "email": "someone@mail.com",
                "lastName": "Sengar",
                "firstName": "Rishabh",
                "userId": "-E9zxTYA8"
            }

        }
    */

    // params: email, password.
    app.post(`${baseUrl}/login`, userController.loginFunction);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/logout to logout user.
     *
     * @apiParam {string} userId userId of the user. (auth headers) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Logged Out Successfully",
            "status": 200,
            "data": null

        }
    */

    // auth token params: userId.
    app.post(`${baseUrl}/logout`, userController.logout);

    app.get(`${baseUrl}/forgot`, userController.forgotPassword);

        app.post(`${baseurl}/createRoom`, ChatRoomController.createChatRoom);
        app.put(`${baseurl}/editRoom`,   ChatRoomController.editChatRoom);
        app.post(`${baseurl}/deleteRoom`, ChatRoomController.deleteChatRoom);

        app.get(`${baseurl}/listAll`, ChatRoomController.listAllRoom);

  



}
