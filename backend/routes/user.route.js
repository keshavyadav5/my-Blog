const express = require('express')
const { test, updateUser, deleteUser, signout } = require('../controller/user.controller')
const verifyToken = require('../utils/verifyUser')
const router = express.Router()

router.post('/test',test)
router.put('/update/:userId',verifyToken,updateUser);
router.delete('/delete/:userId',verifyToken,deleteUser)
router.post('/signout',signout)
module.exports = router
  