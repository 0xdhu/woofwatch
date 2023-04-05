const { createSubwallet, withdrawAllFunds, getCurrentStocks, getFundedOrders } = require('../controllers/subwallet.controller');
const express = require('express');

const router = express.Router();

// ** middleware
const isAuthorize = require('../middleware/auth.middleware');
const isAdmin = isAuthorize("admin");

router.post('/subwallet/create', isAdmin, createSubwallet);
router.post('/withdraw/single', isAdmin, withdrawAllFunds);
router.post('/withdraw/all', isAdmin, withdrawAllFunds);
router.post('/currentStocks', getCurrentStocks);
router.post('/fundedOrders', getFundedOrders);

module.exports = router;