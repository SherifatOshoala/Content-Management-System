const express = require('express')
const router = express.Router()
const authentication = require('../middlewares/authentication.js')
const {addArticle, getArticles, 
    getArticle, updateArticle, deleteArticle} = require('../controllers/articles.controllers.js')
  

router.post("/articles/:user_id/:categ_id?", addArticle );

router.get("/articles", getArticles)

router.get("/article/:id", getArticle);

router.patch("/article/:id", updateArticle );

router.delete("/article/:id", deleteArticle );

module.exports = router