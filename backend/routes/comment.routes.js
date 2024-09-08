const express = require('express')
const {createComment, getComment} = require('../controller/comment.controller')
const verifyToken = require('../utils/verifyUser');
const router = express.Router()

router.post('/create',verifyToken,createComment)
router.get('/getcomment/:postId',getComment)

module.exports = router