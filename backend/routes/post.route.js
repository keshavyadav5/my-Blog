const expresss = require('express');
const verifyToken = require('../utils/verifyUser');
const { create } = require('../controller/post.controller');
const router = expresss.Router()

router.post('/create',verifyToken,create);

module.exports = router
