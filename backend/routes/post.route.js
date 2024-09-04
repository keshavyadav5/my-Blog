const expresss = require('express');
const verifyToken = require('../utils/verifyUser');
const { create, getposts, deletePost, updatePost } = require('../controller/post.controller');
const router = expresss.Router()

router.post('/create',verifyToken,create);
router.get('/getposts',getposts)
router.delete('/deletepost/:postId',deletePost)
router.put('/updatepost/:postId',updatePost)

module.exports = router
