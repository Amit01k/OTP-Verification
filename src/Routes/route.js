const express=require('express')
const router=express.Router()
const userController=require('../controller/userController')

//register the new user
router.post('/api/user',userController.userRegister)
//get user by id
router.get('/api/user/:id',userController.getuserbyId)
//get all user data
router.get('/api/user',userController.getall)
//delete user data
router.delete("/api/user/:id",userController.deletebyid)
//generate jsonweb token fot authentication and authorization
router.post('/api/login',userController.login)
//update the user data
router.put('/api/user/:id',userController.updateUser)
//verify the OTP
router.get('/api/verify-otp',userController.verifyOTP)

module.exports=router