
const express = require('express')
const router = express.Router()
const landing = require('../controllers')

router.get("/", landing);

module.exports = router