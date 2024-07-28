const messages = require("../messages")
const connection = require("../config/sql.js")
const {createUserValidation, validateVerificationData, updateUserValidation, EmailAndPasswordValidation} = require("../validations/user.validations.js")
const {addUserModel, checkIfUserEmailExists,updateIsEmailVerified, getUserModel, updateUserModel, deleteUserModel} = require("../models/users.models.js")
const {insertOtp, checkIfOtpDataExists, deleteOtpData} = require ("../models/otp.models.js")
const {encryptPassword, generateOtp, checkPassword} = require("../Utils")
const {sendMail} = require("../services/email.js")
 
const addUser = async(req, res) => {
    const { username, email, phone, password, password_confirmation } = req.body;
    try {
      const validate = createUserValidation(req.body)
      if(validate != undefined){
        throw new Error(validate.details[0].message)
      }
const checkEmail = await checkIfUserEmailExists(email)
if(checkEmail.length > 0) throw new Error ('This email already exists')
const otp = generateOtp()
await insertOtp(email,otp)
const [hash, salt] = await encryptPassword (password)
await addUserModel(req.body, hash, salt)
   sendMail(email,'Your OTP!', `Please, use this ${otp} to verify your mail`)
      res.status(201).json({
        success: true,
        message: `${messages.otpNoticeMessage}, ${username}!`,
      })
    
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

const verifyUserEmail = async(req, res) => {
const {email, otp } = req.params
try{
const validate = validateVerificationData (req.params)
if (validate != undefined) throw new Error ('Invalid email or otp!')
const checkIfDataExists = await checkIfOtpDataExists (req.params)
if(checkIfDataExists.length == 0) throw new Error ('Invalid email or otp!')
const convertMillisecondsToMinutes = 1000 * 60
const otpCreatedTime = new Date(checkIfDataExists[0].created_at).getTime()
const timeNow = new Date().getTime()
const timeDifferenceInMillisecs = timeNow - otpCreatedTime
const timeInMinutes = Math.floor(timeDifferenceInMillisecs /convertMillisecondsToMinutes)
if(timeInMinutes > 20) throw new Error ('Invalid email or otp!')
await updateIsEmailVerified(email)
await deleteOtpData(req.params)
const getUserDetails = await checkIfUserEmailExists(email)
sendMail(email,'Verification Successful', `Welcome to WeBlog, ${getUserDetails[0].username}. Explore!`)
      res.status(201).json({
        success: true,
        message: `${messages.landing},${getUserDetails[0].username}!`,
      })
}
catch(error){
  res.status(500).json({
    status: false, 
    message: error.message
  })
}
}

const userLogin = async (req, res) => {
  const {email, password} = req.body
  try{
    const validate = EmailAndPasswordValidation (req.body)
    if (validate != undefined) throw new Error('Invalid email or password!')
const getUserByEmail = await checkIfUserEmailExists(email)
if (getUserByEmail.length == 0) throw new Error ('Invalid email or password!')
const hash = getUserByEmail[0].password_hash
const comparePassword = await checkPassword(password, hash)
if(!comparePassword) throw new Error ('Invalid email or password!')
res.status(201).json({
  status: true,
  message: messages.login
})

  }catch(error){
res.status(500).json({
  status: false,
  message: error.message
})} 
}
  
const getUser = async (req, res) => {
      const id = req.params.id;
      try {
  const getUser = await getUserModel(id)
            if (getUser.length == 0) {
              throw new Error("No such id");
            } else {
              delete getUser[0].user_id;
              res.status(200).json({
                success: true,
                message: messages.getUser,
                data: getUser[0],
              });
            }
          } catch (error) {
            res.status(500).json({
              status: false,
              message: error.message,
            });
          }
    } 

const updateUser = async (req, res) => {
    try {
      const id = req.params.id;
  const { username, email, phone } = req.body;
      const validate = updateUserValidation(req.body)
      if(validate != undefined){
        throw new Error(validate.details[0].message)
      }
  
      let keys = [];
      let values = Object.values(req.body);
  
      if (username) {
        keys.push("username = ?");
      }
  
      if (email) {
        keys.push("email = ?");
      }
  
      if (phone) {
        keys.push("phone = ?");
      }
  
      keys = keys.join();
  
 const updateUser = await updateUserModel(keys, values, id)
            if (updateUser.affectedRows == 0) throw new Error("No such user_id!");
            else {
              res.status(200).json({
                status: true,
                message: messages.updateUser,
                data: updateUser
              });
            }
        
        }
        catch (error) {
          res.status(500).json({
            success: false,
            message: error.message,
          });
        }
      }

const deleteUser = async (req, res) => {
    try {
  const id = req.params.id;
  const getUser = await getUserModel (id)
            if (getUser.length == 0) throw new Error("No such ID!");
      else{
await deleteUserModel (id)
        res.status(200).json({
          status: true,
          message: messages.deleteUser,
          data: getUser[0],
        });
      }          
              }catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

module.exports = { addUser, verifyUserEmail, userLogin, getUser, updateUser, deleteUser}