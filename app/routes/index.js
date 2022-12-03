const express = require('express');
const controllers = require('../controllers/index.js');

const router = express.Router()
router.get('/ping', controllers.pong);
router.post('/login', controllers.onLogin);
router.post('/view-content', controllers.viewContent);
router.post('/find-incentive', controllers.findIncentive);
router.get('/find-incentive-factor', controllers.findIncentiveFactor);
router.get('/get-incentive-data', controllers.getIncentiveData);


module.exports =  router;