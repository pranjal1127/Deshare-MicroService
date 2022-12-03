const express = require('express');
const controllers = require('../controllers/index.js');

const router = express.Router()
router.get('/ping', controllers.pong);
router.post('/login', controllers.onLogin);

module.exports =  router;