const express = require('express')
const router = express.Router()
const authentication = require('../middlewares/authentication.js')
const {addUser, verifyUserEmail, userLogin, getUser, updateUser, deleteUser} = require('../controllers/user.controllers.js')

router.post("/users", addUser);

router.get("/verify-user-email/:email/:otp", verifyUserEmail);

router.post("/login", userLogin)

router.get("/user/:id", getUser);

router.patch("/user/:id", authentication, updateUser);

router.delete("/user/:id", authentication, deleteUser );


module.exports = router