const express=require('express');
const protecctedRoute=require('../middleware/protectedroute')
const router=express.Router();
const {loginController,logoutController,signController,updateController,checkController}=require('../controller/authController')
router.post('/signup',signController)
router.post('/login',loginController)
router.post('/logout',logoutController)
router.put('/update-profile',protecctedRoute,updateController)
router.get('/check',protecctedRoute,checkController)

module.exports=router;