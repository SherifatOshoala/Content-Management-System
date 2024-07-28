const mysql = require("mysql2");
const connection = require("../config/sql.js")


const insertOtp = (email,Otp) => {
return new Promise ((resolve, reject) => {
    connection.query ("INSERT INTO OTP (email, Otp) VALUES (?,?) ", [email, Otp], (error, result) => {
        if(error) reject (error)
        resolve (result)
    })
})

}

const checkIfOtpDataExists = (data) => {
    return new Promise ((resolve, reject) => {
        connection.query ("SELECT * FROM OTP WHERE email = ? AND otp = ?", [data.email, data.otp], (error, result) => {
            if(error) reject (error)
            resolve (result)
        }) 
    })
}

const deleteOtpData = (data) => {
    return new Promise ((resolve, reject) => {
        connection.query ("DELETE FROM OTP WHERE email = ? AND otp = ?", [data.email, data.otp], (error, result) => {
            if(error) reject (error)
            resolve (result)
        }) 
    })
}

module.exports = { 
    insertOtp,
    checkIfOtpDataExists,
    deleteOtpData
}