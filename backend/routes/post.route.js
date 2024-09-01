const expresss = require('express');
const verifyToken = require('../utils/verifyUser');
const { create, getposts } = require('../controller/post.controller');
const router = expresss.Router()

router.post('/create',verifyToken,create);
router.get('/getposts',getposts)

module.exports = router
