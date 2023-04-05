var express = require('express');
const { getTokenInfo } = require('../controllers/erc20.controller');
const { createIntent, getIntentInfo, cancelIntent, getIntentStatus, updateOrderInfo } = require('../controllers/paymentIntent.controller');
var router = express.Router();
// var { createClient } = require('redis');
// const redis_url = process.env.REDIS_URL | 'redis://127.0.0.1:6379';
// const client = createClient(redis_url);

// ** middleware
const isAuthorizeForAPI = require('../middleware/apikey.middleware');

/**
 * @dev request "paymentIntent.create"
 * @param { shipping_address, product_detail, billing_address }
 * @return { unique_address }
 */
router.post('/payment_intents/create', isAuthorizeForAPI, createIntent);

/**
 * @dev request "paymentIntent cancel"
 * @param { address }
 */
router.post('/payment_intents/cancel', isAuthorizeForAPI, cancelIntent);

/**
 * @dev request "paymentIntent status"
 * @param { address }
 * @return { status } payment.waiting, payment.funded, payment.withdrawed, empty
 */
router.post('/payment_intents/status', isAuthorizeForAPI, getIntentStatus);

/**
 * @dev request "paymentIntent info"
 * @param { address }
 * @return { data } 
 */
router.post('/payment_intents/getInfo', isAuthorizeForAPI, getIntentInfo);

/**
 * @dev request "erc20 token metadata"
 * @param { address }
 * @return { status } payment.waiting, payment.funded, payment.withdrawed
 */
router.post('/token/metadata', getTokenInfo);

/**
 * @dev request "paymentIntent.funded" record with order_id, pay_id
 * @param { address, order_id, pay_id }
 */
router.post('/order_history/update', isAuthorizeForAPI, updateOrderInfo);

module.exports = router;
