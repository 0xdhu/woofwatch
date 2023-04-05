const { createClient } = require('redis');
const { redis_url } = require('../config');
const PriceOracle = require('../models/PriceOracle.model');
const { getLatestCryptoPrice } = require('../helpers/PriceOracel.helper');

const priceKey = "price_oracle";
const getTokenPrice = async (req, res) => {
    let client;
    try {
        client = createClient(redis_url);
        await client.connect();

        const price = await client.get(priceKey);
        if (price) {
            return res.status(200).send({
                code: 200,
                message: "success",
                data: price
            });
        }
        
        const latestPrice = await getLatestCryptoPrice();

        await client.set(priceKey, latestPrice,'EX', 15);

        return res.status(200).send({
            code: 200,
            message: "success",
            data: latestPrice
        });
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            code: 500,
            message: "Something went wrong"
        });
    } finally {
        if (client) {
            client.quit();
        }
    }
};

const setTokenPrice = async (req, res) => {
    let client;

    try {
        const { price } = req.body;

        const filter = { isValid: true };
        const update = { isValid: false };
        const sort = { createAt: -1, updateAt: -1 };
        await PriceOracle.findOneAndUpdate(filter, update).sort(sort);

        const insert = { 
            price, 
            isValid: true,
            createAt: Date.now(),
            updateAt: Date.now()
        };
        await PriceOracle.create(insert);

        client = createClient(redis_url);
        await client.connect();

        await client.set(priceKey, price,'EX', 15);
        return res.status(200).send({
            code: 200,
            message: "success"
        });
    } catch (err) {
        return res.status(500).send({
            code: 500,
            message: "Internal server error"
        })
    } finally {
        if (client) {
            client.quit();
        }
    }
}

module.exports = {
    getTokenPrice,
    setTokenPrice
}