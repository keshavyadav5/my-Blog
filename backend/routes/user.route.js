const express = require('express')
const { test, updateUser } = require('../controller/user.controller')
const verifyToken = require('../utils/verifyUser')
const router = express.Router()

router.post('/test',test)
router.put('/update/:userId',verifyToken,updateUser);
module.exports = router
  