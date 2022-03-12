var express = require('express');
var router = express.Router();
let auth= require("../utils/middleware")
var User= require("../controllers/user.controller")
let userController= new User()
router.post('/register',userController.register);
router.post('/login',userController.login);
router.get('/profile',auth,userController.getUser);
router.put('/profile',auth,userController.updateUser);
router.put('/password',auth,userController.updatePassword);

module.exports = router;
