const mysql = require("mysql2");
const connection = require("../config/sql.js")
const { v4: uuidv4 } = require("uuid");

const addUserModel = (data, hash ,salt) => {
    return new Promise ((resolve, reject) => {
        connection.query(
            {
              sql: `INSERT into users (user_id, username, email, phone, password_hash, password_salt) VALUES(?,?,?,?,?,?)`,
              values: [uuidv4(), data.username, data.email, data.phone, hash, salt],
            },
            (error, result) => {
              if (error) reject(error);
              resolve (result)
            }
          );
    })
   
}

const checkIfUserEmailExists = (email) => {
return new Promise ((resolve, reject) => {
  connection.query("SELECT * FROM USERS WHERE email = ?", [email], (error, result) => {
    if (error) reject(error);
    resolve (result)
  })
})
}

const updateIsEmailVerified = (email) => {
  return new Promise ((resolve, reject) => {
    connection.query("UPDATE USERS SET is_email_verified = ? WHERE email = ? ", [true, email], (error, result) => {
      if (error) reject(error);
      resolve (result)
    })
  })
}

const getUserModel = (data)=> {
return new Promise ((resolve, reject) => {
  connection.query(
    {
      sql: "SELECT USERS.*, ARTICLES.title FROM USERS LEFT JOIN ARTICLES ON USERS.username = ARTICLES.username WHERE USERS.user_id = ? ",
      values: [data],
    },
    (error, result) => { 
      if(error) reject(error)
  resolve (result)
    })
}) 
  }

const getUserByUsernameModel = (name) => {
return new Promise ((resolve, reject) => {
  connection.query({
    sql: "SELECT * FROM USERS WHERE username = ? ",
    values: [name]
  }, (error, result) => {
    if(error) reject (error)
    resolve (result)
  })
  
})
  }

const updateUserModel = (keys, values, id)=> {
return new Promise ((resolve, reject) => {
  connection.query(
    {
      sql: `UPDATE USERS SET ${keys} WHERE user_id = ?`,
      values: [...values, id],
    },
    (error, result) => {
      if(error) reject(error)
      resolve (result)
    }
  )
})
}

const deleteUserModel = (id) => {
  return new Promise ((resolve, reject) => {
    connection.query(
      {
        sql: "DELETE FROM USERS WHERE user_id = ? ",
        values: [id],
      },
      (error, result1) => {
        if(error) reject(error)
        resolve(result1)
      })
  })
}


module.exports = {addUserModel, checkIfUserEmailExists,updateIsEmailVerified, getUserModel,getUserByUsernameModel, updateUserModel, deleteUserModel}