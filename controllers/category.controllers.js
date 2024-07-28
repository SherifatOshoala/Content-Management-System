const messages = require("../messages")
const connection = require("../config/sql.js");
const { createCategoryValidation, updateCategoryValidation } = require("../validations/category.validations.js");
const {addCategoryModel, getCategoriesModel, updateCategoryModel, getCategoryModel, deleteCategoryModel} = require("../models/category.models.js")


const addCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        const validate = createCategoryValidation(req.body)
        if(validate != undefined){
         throw new Error (validate.details[0].message)
        }   
     const addCategory = await addCategoryModel (req.body)
            res.status(201).json({
              success: true,
              message: messages.addCategory,
              data: addCategory
            });
          } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

const getCategories = async (req, res) => {
    let order = req.query.order;
    try {
      const orderColumns = ["name", "description", "created_at", "updated_at"];
      let orderColumn = orderColumns.includes(order) ? order : "created_at";
     const fetchCategories = await getCategoriesModel(orderColumn)

            if (fetchCategories.length == 0) throw new Error("No category found!")
            res.status(200).json({
              status: true,
              message: messages.getCategories,
              data: fetchCategories
            });
     
        }
 catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

const updateCategory = async (req, res) => {
    const id = req.params.id;
    const { name, description } = req.body;
    try {
        const validate = updateCategoryValidation(req.body)
        if(validate != undefined){
         throw new Error (validate.details[0].message)
        }   
      let keys = [];
      let values = Object.values(req.body);
      if (name) keys.push(`name = ?`);
      if (description) keys.push(`description = ?`);
      keys = keys.join();
const updateCateg = await updateCategoryModel (id, values, keys)
            if (updateCateg.affectedRows == 0) throw new Error("No such categ_id!");
        res.status(200).json({
              status: true,
              message: messages.updateCategory,
              data: updateCateg,
            });
        }
catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

const deleteCategory = async (req, res) => {
    const id = req.params.id
    try {
    const checkIfCategoryExists = await getCategoryModel(id)
    console.log(checkIfCategoryExists)
            if (checkIfCategoryExists.length == 0) throw new Error("No such categ_id!");
 await deleteCategoryModel(id)  
                delete checkIfCategoryExists[0].categ_id;
               res.status(200).json({
                  status: true,
                  message: messages.deleteCategory,
                  data: checkIfCategoryExists[0]
                });
              } 
 catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
 
module.exports = { addCategory, getCategories, updateCategory, deleteCategory}