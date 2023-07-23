
const userModel = require('../Models/userModel')
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose")
const client = require('twilio')(process.env.accountSid, process.env.authToken);
const isrequestBody = (requestBody) => {
    return Object.keys(requestBody).length > 0
}
// const isValidReferralCode = (referral_code) => {
//     return ['ABCD', 'EFGH', 'IJKL','MNOP','QRST'].indexOf(referral_code) !== -1

// }
//isValidobjectId function, checking input id is valiad or not according to mongoDB id.
const isValidobjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
}
//isValid will check input field,input field undefined, null, string and input length=0 or not
const isValid = (value) => {
    if (typeof value === "undefined" || value === null)
        return false
    if (typeof value === "string" && value.trim().length === 0)
        return false
    else
        return true
}
//userRegister function for create new user
const inputUser = []
let ref=['ABCD', 'EFGH', 'IJKL','MNOP','QRST']
const userRegister = async (req, res) => {
    try {
        // console.log(req.body)
        inputUser.splice(0, inputUser.length)
        //validation for checking input body ,if body is empty it will send error.
        if (!isrequestBody(req.body)) {
            return res.status(400).send({ status: false, message: "Invalid parameters, please provide user details" })
        }
        //distructuring the input fields
        const { name, mobile_number, email, password,referral_code,date_of_birth } = req.body

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "please provide user_name" })

        }

        if (!isValid(date_of_birth)) {
            return res.status(400).send({ status: false, message: "please provide date_of_birth" })

        }
        if (!(/^\d{2}-\d{2}-\d{4}$/).test(date_of_birth)) {
            return res.status(400).send({ status: false, message: "invalid foramte please enter,date_of_birth in DD-MM-YYYY format" })

        }
        if (referral_code && !ref.includes(referral_code)) {
            return res.status(400).send({ status: false, message: "Invalid referral_code" })
        }

        if (!isValid(mobile_number)) {
            return res.status(400).send({ status: false, message: "please provide mobile_number" })
        }
        if (!(/^\d{10}$/.test(mobile_number))) {
            return res.status(400).send({ status: false, message: "Mobile Number is not valid" })
        }

        let duplicatephone = await userModel.findOne({ mobile_number ,isDeleted: false});
        if (duplicatephone) {
            return res.status(400).send({ status: false, message: "phone is already in use,please use other mobile_number or hit he login api" })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "please provide email" })
        }
        if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email))) {
            return res.status(400).send({ status: false, message: "email is not valid" })
        }

        let isDuplicateEmail = await userModel.findOne({ email });
        if (isDuplicateEmail) {
            return res.status(404).send({ status: false, message: "Email is already in use" })
        }
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "please provide password" })
        }
        if (!(password.length >= 8 && password.length <= 15)) return res.status(400).send({ status: false, message: "password is not valid enter password 8 to 15 character" })
        sendOtpInFunction(mobile_number)
        inputUser.push(req.body)


        return res.send({ status: true, message: "Verify the OTP please, hit the verify-otp Api to store the data" })
    }
    catch (err) {
        return res.send(err.message)

    }
}



//login function for creating jsonwebtoken
const login = async (req, res) => {
    try {
        const number = req.query.mobile_number
        if (!(/^\d{10}$/.test(number))) {
            return res.status(400).send({ status: false, message: "Mobile Number is not valid, please enter 7979848429 mobile number" })
        }
        let mobile = await userModel.findOne({mobile_number:number,isDeleted: false  });
        if (!mobile) {
            return res.status(400).send({ status: false, message: "mobile number not registerd, please regirster yourself" })
        }
        sendOtpInFunction(number)
        return res.status(200).send({ message: "OTP successfully send on your mobile number please hit the otp-verify api", token: number })
    } catch (err) {
        return res.status(404).send({ status: false, message: err.message })
    }
}

//getuserbyId function for get user data by userId
const getuserbyId = async (req, res) => {
    try {
        const userId = req.params.id

        if (!userId) {

            return res.status(400).send({ status: false, message: "please enter userId to find the user" })
        }

        if (!isValidobjectId(userId)) {
            return res.status(400).send({ status: false, message: "please enter valid userId" })
        }
        data = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!data) {
            return res.status(404).send({ status: false, message: "user not found please enter valid user id" })
        }
        return res.send({ status: true, message: "user data", data })
    }
    catch (err) {
        return res.status(404).send({ status: false, message: err.message })
    }
}

//getall function , by this function we can see all the users data
const getall = async (req, res) => {
    data = await userModel.find({ isDeleted: false });
    return res.status(200).send({ status: true, message: "users list", data: data })

}

// updateUSer function, by this function we can update theuser data
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id

        if (!userId) {

            return res.status(400).send({ status: false, message: "please enter userId to find the user" })
        }

        if (!isValidobjectId(userId)) {
            return res.status(400).send({ status: false, message: "please enter valid userId" })
        }
        const body = req.body
        const update = await userModel.findByIdAndUpdate({ _id: userId, isDelete: false }, body, { new: true })
        return res.status(200).send({ status: true, message: "user data updated successfully", data: update })
    }
    catch (err) {
        return res.status(404).send({ status: false, message: err.message })
    }
}

//deletebyId function , by this function we can delete the user
const deletebyid = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).send({ status: false, message: "please enter userId to find the user" })
        }
        if (!isValidobjectId(userId)) {
            return res.status(400).send({ status: false, message: "please enter valid userId" })
        }
        data = await userModel.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() }, { new: true });
        if (!data) {
            return res.status(404).send({ status: false, message: "user not found please enter valid user id" })
        }
        return res.status(200).send({ status: true, message: "data deleted successfully" })
    } catch (err) {
        return res.status(404).send({ status: false, message: err.message })
    }
}

//below the function generate 6 digit and we and OTP by twilio to verify the user
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}
otp = generateOTP();

const sendOtp = async (req, res) => {
    client.messages
        .create({
            body: `Your OTP for verification is: ${otp}`,
            from: '+15739733597',
            to: '+917979848429'
        })
        .then(() => {
            return res.send('OTP successfully send')
        })
}
//sendOtpInFunction function send the 6 Digit OTP on given number
//but i have no upgraded version of twilio, so i need to verify the number to send otp
//we can send OTP on 7979848429, 9565361447, 7409150572,7383444636
const sendOtpInFunction = async (number) => {
    console.log(number)
    client.messages
        .create({
            body: `Your OTP for verification is: ${otp}`,
            from: '+15739733597',
            to: `+91${number}`
        })
        
}


const verifyOTP = async (req, res) => {
    try {
        let input = req.query.otp
        if (input != otp) {  
            return res.status(400).send("worong OTP!, please enter correct OTP")
        }
        let create = await userModel.create(inputUser[0])
        inputUser.splice(0, inputUser.length)
        return res.status(201).send({msg:"data successfully created",data:create})

    } catch (error) {
        console.error('Error verifying OTP:', error);
    }
}

module.exports.verifyOTP = verifyOTP;
module.exports.sendOtp = sendOtp;
module.exports.getall = getall;
module.exports.getuserbyId = getuserbyId;
module.exports.userRegister = userRegister;
module.exports.deletebyid = deletebyid;
module.exports.login = login;
module.exports.updateUser = updateUser;
