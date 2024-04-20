const express = require('express');
const Router = express.Router();
const UserController = require('../controllers/User');

// SIGNUP API
Router.post('/register', UserController.RegisterUser)

// LOGIN API
Router.post('/login', UserController.LoginUser);

// GET USERS API
Router.get('/', UserController.GetUsers);

module.exports = Router;