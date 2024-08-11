const express = require('express')
const { SignUp } = require('../controller/auth.controller')
const router = express.Router()

router.post('/signup',SignUp)

module.exports = router