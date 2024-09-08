const express = require('express')
const {createComment, getComment, likeComment, editComment} = require('../controller/comment.controller')
const verifyToken = require('../utils/verifyUser');
const router = express.Router()

router.post('/create',verifyToken,createComment)
router.get('/getcomment/:postId',getComment)
router.put('/likeComment/:commentId',verifyToken,likeComment)
router.put('/editComment/:commentId',verifyToken,editComment)

module.exports = router