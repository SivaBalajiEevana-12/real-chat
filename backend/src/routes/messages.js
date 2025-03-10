const express=require('express');
const protecctedRoute=require('../middleware/protectedroute')
const router=express.Router();
// const {loginController,logoutController,signController,updateController,checkController}=require('../controller/authController')
const {getUserForSideBar,getMessages,sendMessage}=require('../controller/messageController')
router.get('/users',protecctedRoute,getUserForSideBar);
router.get('/:id',protecctedRoute,getMessages);
router.post('/send/:id',protecctedRoute,sendMessage);

module.exports=router;