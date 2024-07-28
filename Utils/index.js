const bcrypt = require ("bcrypt")

const generateOtp = () => { 
    let otp = "" + Math.floor(Math.random() * 1000000)
    if (otp.length < 6) otp = Number(otp) + 100000
    return otp

}

const encryptPassword = (originalPassword) => {
    return new Promise ((resolve, reject) => {
const saltRounds = 10 

    bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err) reject(err)
        bcrypt.hash(originalPassword, salt, function(err, hash) {
        if(err) reject (err)
        resolve([hash, salt])
    });
    })
    })
}

const checkPassword = (originalPassword, hash) => {
    return new Promise ((resolve, reject) => {
    bcrypt.compare(originalPassword, hash, function(err, result) {
   if (err) reject (err)
   resolve (result)
    })
})
}

module.exports = {generateOtp, encryptPassword, checkPassword}