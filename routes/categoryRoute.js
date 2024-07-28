const express = require('express')
const router = express.Router()
const authentication = require('../middlewares/authentication.js')
const {addCategory, getCategories, 
    updateCategory, deleteCategory} = require('../controllers/category.controllers.js')


router.post("/categories", addCategory);

router.get("/categories", getCategories);

router.patch("/category/:id", updateCategory);

router.delete("/category/:id", deleteCategory);

module.exports = router