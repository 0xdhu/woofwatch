const express = require('express');
const router = express.Router();

// ** middleware
const isAuthorize = require('../middleware/auth.middleware');
const { setTokenPrice, getTokenPrice } = require('../controllers/oracle.controller');
const isAdmin = isAuthorize("admin");

router.post('/set_price', isAdmin, setTokenPrice);
router.post('/get_price', getTokenPrice);

module.exports = router;