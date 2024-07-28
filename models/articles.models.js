const mysql = require("mysql2");
const connection = require("../config/sql.js")
const { v4: uuidv4 } = require("uuid");

const addArticleModel = (data, username, name) => {
return new Promise ((resolve, reject) => {
    connection.query(
        {
          sql: "INSERT into ARTICLES (article_id,title,description,body,username,name) VALUES(?,?,?,?,?,?)",
          values: [
            uuidv4(),
            data.title,
            data.description,
            data.body,
            username,
            name,
          ],
        },
        (error, result) => {
            if(error) reject(error)
            resolve(result)
        })
})
}

const getArticlesBySearchModel =(search, order) => {
    return new Promise ((resolve, reject) => {
        connection.query(
            {
              sql: `SELECT * FROM ARTICLES WHERE title LIKE ? OR description LIKE ? OR body LIKE ? OR username LIKE ? OR name LIKE ? ORDER BY ${order}`,
              values: [
                `%${search}%`,
                `%${search}%`,
                `%${search}%`,
                `%${search}%`,
                `%${search}%`,
              ],
            },
            (error, result) => {
                if(error) reject (error)
                resolve (result)
            })
    })
}

const getArticlesModel = (order) => {
    return new Promise ((resolve, reject) => {
        connection.query(
            {
              sql: `SELECT * FROM ARTICLES ORDER BY ${order}`,
            },
            (error, result) => {
                if (error) reject (error)
                resolve (result)
            })
    })
}

const getArticleModel = (id)=> {
    return new Promise ((resolve, reject) => {
        connection.query(
            {
              sql: "SELECT * FROM ARTICLES WHERE article_id = ?",
              values: [id],
            },
            (error, result) => {
                if(error) reject (error)
                resolve (result)
            })
    })
}

const updateArticleIfNameOrUsername = (keys, values, id) => {
    return new Promise ((resolve, reject) => {
        connection.query({
            sql:`UPDATE ARTICLES SET ${keys} WHERE article_id = ?`,
            values: [...values,id]
          },(error, result) => {
if(error) reject (error)
resolve(result)
          })
    })
}

const updateArticleModel = (keys, values, id) => {
    return new Promise ((resolve, reject) => {
        connection.query({
            sql:`UPDATE ARTICLES SET ${keys} WHERE article_id = ?`,
            values: [...values,id]
          },(error, result) => {
            if(error) reject(error)
            resolve (result)
          })

    })
}

const deleteArticleModel = (id) => {
    return new Promise ((resolve, reject) => {
        connection.query(
          {
            sql: "DELETE FROM ARTICLES WHERE article_id = ? ",
            values: [id],
          },
          (error, result) => {
            if(error) reject(error)
            resolve(result)
          })
      })
}

module.exports = {addArticleModel, getArticlesBySearchModel, getArticlesModel, getArticleModel, updateArticleIfNameOrUsername, updateArticleModel, deleteArticleModel}