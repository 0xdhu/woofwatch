const { checkTokenBalance } = require("../helpers/balance.helper");
const NewSubWallet = require("../models/NewSubWallet.model");
const OrderHistory = require("../models/OrderHistory.model");

/* eslint-disable etc/no-commented-out-code */
const cron = require("node-cron");
//** PayIntent Model */
const PayIntent = require('../models/PayIntent.model');
const { getLatestCryptoPrice } = require("../helpers/PriceOracel.helper");
const { doExpireIntent } = require("../helpers/PaymentIntent.helper");

// Every 2 mins
const monitorIntentCronJob = cron.schedule(
    "*/2 * * * *",
    () => {
        monitorStart();
    },
    {
        scheduled: false,
    }
);

module.exports = monitorIntentCronJob;

const monitorStart = async () => {
    const intentData = await getCreatedIntentList();
    // Every 30 seconds, it should handle only 5 to optimize server
    const len = intentData.length;

    const latestPrice = await getLatestCryptoPrice();
    for(let i=0; i<len; i++) {
        try {
            const doc = intentData[i];
            const { address, intent_info } = doc;
            console.log("address_monitor", address)
            
            const { amount: product_price, currency } = intent_info;
            
            const balance = await checkTokenBalance(address);
            // At least, value should be bigger than 0.05%
            if (product_price * 0.9995 <= balance * latestPrice) {
                await processAfterFunded(address, balance, intent_info, latestPrice, currency)
            } else {
                const isExpired = doc.checkExpired();
                console.log(isExpired)

                if (isExpired) {
                    // If 30mins passed after created, it should be expired
                    await doExpireIntent(address);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}

const getCreatedIntentList = async () => {
    const filter = { status: 'payment.waiting' };
    const limit = 10; // max
    const fields = 'address intent_info createAt';

    const docs = await PayIntent.find(filter)
        .sort({ createAt: 1 })
        .select(fields)
        .limit(limit);
    return docs;
}

const processAfterFunded = async (address, payAmount, intent_info, latestPrice, currency) => {
    // Get wallet info
    const selectFields = 'parent hdPath hdPathIndex'
    const newSubWalletObject = await NewSubWallet.findOne({ address }).select(selectFields);
    if (!newSubWalletObject) {
        return;
    }

    // move to OrderList
    const { parent, hdPath, hdPathIndex } = newSubWalletObject;
    console.log("processAfterFunded", newSubWalletObject);
    const newDocument = {
        address,
        parent, 
        hdPath,
        hdPathIndex,
        intent_info,
        payAmount,
        crypto: {
            price: latestPrice,
            oracleTs: Date.now(),
            currency
        },
        status: "payment.funded",
        hookCount: 0,
        createAt: Date.now(),
        updateAt: Date.now()
    }
    await OrderHistory.create(newDocument);

    // remove from payIntent list
    await PayIntent.deleteOne({ address });
    // remove from newSubWallet list
    await NewSubWallet.deleteOne({ address });
}