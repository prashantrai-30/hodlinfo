const express = require('express');
const router = express.Router();
const {getTicker,bestprice} = require('../controllers/ticker')

router.get('/gettickers',getTicker);

router.get('/bestprice',bestprice);

module.exports = router;