const messages = require("../messages")
const connection = require("../config/sql.js");
const { v4: uuidv4 } = require("uuid");
const { createArticleValidation, updateArticleValidation } = require("../validations/article.validations.js");
const {addArticleModel, getArticlesBySearchModel, getArticlesModel, getArticleModel, updateArticleIfNameOrUsername, updateArticleModel, deleteArticleModel } = require("../models/articles.models.js")
const { getUserModel, getUserByUsernameModel} = require("../models/users.models.js")
const {getCategoryModel, getCategoryByNameModel} = require("../models/category.models.js")


const addArticle = async(req, res) => {
    const { title, description, body } = req.body;
    let { user_id, categ_id } = req.params;
categ_id = categ_id ||"18a2e39f-fa84-4077-a0ce-06112507ed93"

    try {
   const validate = createArticleValidation(req.body)
   if(validate != undefined){
    throw new Error (validate.details[0].message)
   }   
const checkIfUserExists = await getUserModel(user_id)
  if (checkIfUserExists.length == 0) throw new Error("no such user_id");
const checkIfCategoryExists = await getCategoryModel(categ_id)
  if (checkIfCategoryExists.length ==0) throw new Error("no such categ_id");
await addArticleModel(req.body, checkIfUserExists[0].username, checkIfCategoryExists[0].name)
                          res.status(201).json({
                            success: true,
                            message:messages.createArticle,
                            data: addArticle,
                          });
                        }
  catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

const getArticles = async (req, res) => {
    let { search, order } = req.query;
    try {
      const orderColumns = [
        "title",
        "description",
        "body",
        "username",
        "name",
        "created_at",
        "updated_at",
      ];
  
      let orderColumn = orderColumns.includes(order) ? order : "created_at";
  
      if (search) {
       const getArticlesBySearch = await getArticlesBySearchModel(search, orderColumn)
              if (getArticlesBySearch.length == 0) throw new Error("No match found!");
              return res.status(200).json({
                status: true,
                message: messages.getArticles,
                data: getArticlesBySearch
              });
          }
      
    else {
  const getArticles = await getArticlesModel(orderColumn)
              if (getArticles.length == 0) throw new Error("No article found!")
              return res.status(200).json({
                status: true,
                message: messages.getArticles,
                data: getArticles,
              });
          }

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

const getArticle = async(req, res) => {
    try {
      const id = req.params.id;
     const getArticle = await getArticleModel (id)
            if (getArticle.length == 0) 
              throw new Error("No such article_id");
            delete getArticle[0].article_id;
            res.status(200).json({
              success: true,
              message:messages.getArticle ,
              data: getArticle[0],
            });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

const updateArticle = async (req, res) => {
    const id = req.params.id;
    const { title, description, body, username, name } = req.body;
    try {
    const validate = updateArticleValidation(req.body)
    if(validate != undefined){
     throw new Error (validate.details[0].message)
     }   
  
      let keys = [];
      let values = Object.values(req.body);
      let isUsername = false;
      let isName = false;
  
      for (let key in req.body) {
        keys.push(`${key} = ?`);
      }
      keys = keys.join(", ");
      if (keys.includes("username")) isUsername = true;
      if(keys.includes(" name")) isName = true;
  
      if (isUsername || isName) {
        if(isUsername){
       const checkIfUserExists = await getUserByUsernameModel(username)
              if(checkIfUserExists.length == 0) throw new Error('This user does not exist!')
        }
        
        if(isName){
         const checkIfCategoryExists = await getCategoryByNameModel(name) 
              if(checkIfCategoryExists.length == 0) throw new Error('This category does not exist!')
    
        }
const updateArticle = await updateArticleIfNameOrUsername(keys, values, id)
    if(updateArticle.affectedRows == 0)throw new Error('This article_id does not exist!')
    res.status(200).json({
  status: true,
  message: messages.updateArticle,
  data: updateArticle
  })
      }

  const updateArticle = await updateArticleModel (keys, values, id)
  if(updateArticle.affectedRows == 0)throw new Error('This article_id does not exist!')
  res.status(200).json({
  status: true,
  message: messages.updateArticle,
  data: updateArticle
  })

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

const deleteArticle = async (req, res) => {
    const id = req.params.id;
    try {
  const checkIfArticleExists = await getArticleModel (id)
            if (checkIfArticleExists.length == 0) throw new Error("No such article_id!");
            await deleteArticleModel (id)
                delete checkIfArticleExists[0].article_id;
                res.status(200).json({
                  status: true,
                  message: messages.deleteArticle,
                  data: checkIfArticleExists[0],
                });
              }
   catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }


  module.exports = {addArticle, getArticles, getArticle, updateArticle, deleteArticle}