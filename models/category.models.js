const mysql = require("mysql2");
const connection = require("../config/sql.js")
const { v4: uuidv4 } = require("uuid");


const addCategoryModel = (data) => {

return new Promise ((resolve, reject) => { 

    connection.query(
        {
          sql: "INSERT into CATEGORIES (categ_id, name, description) VALUES(?,?,?)",
          values: [uuidv4(), data.name, data.description],
        },
        (error, result) => {
if(error) reject (error)
resolve (result)
        })
})
}

const getCategoryByNameModel = (name) => {
        return new Promise((resolve, reject) => {
                connection.query({
                        sql: "SELECT * FROM CATEGORIES WHERE name = ? ",
                        values: [name]
                      }, (error, result) => {
                        if(error) reject (error)
                        resolve (result)
                      })
                           
        })
}

const getCategoriesModel = (data) => {
        return new Promise ((resolve, reject) => {
                connection.query(
                        {
                          sql: `SELECT * FROM CATEGORIES ORDER BY ${data}`,
                        },
                        (error, result) => {
                                if(error) reject(error)
                                resolve(result)
                        })
        })
}

const updateCategoryModel = (id, values, keys) => {
        return new Promise ((resolve, reject) => {
                connection.query(
                        {
                          sql: `UPDATE CATEGORIES SET ${keys} WHERE categ_id = ?`,
                          values: [...values, id],
                        },
                        (error, result) => {
if(error) reject (error)
resolve(result)
                        })
        })
}

const getCategoryModel = (id) => {
        return new Promise ((resolve, reject) => {
                connection.query(
                        {
                          sql: "SELECT * FROM CATEGORIES WHERE categ_id = ?",
                          values: [id],
                        },
                        (error, result1) => {
                                if(error) reject(error)
                                resolve(result1)
                        })   
        })
}

const deleteCategoryModel = (id) => {
        return new Promise ((resolve, reject) => {
                connection.query(
                        {
                          sql: "DELETE FROM CATEGORIES WHERE categ_id = ? ",
                          values: [id],
                        },
                        (error, result) => {
                                if(error) reject (error)
                                resolve (result)
                        })    
        })
}

module.exports = {addCategoryModel, getCategoriesModel, getCategoryModel, getCategoryByNameModel, updateCategoryModel, deleteCategoryModel}
