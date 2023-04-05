const PriceOracle = require("../models/PriceOracle.model");

const getLatestCryptoPrice = async () => {
    try {
        const filter = { isValid: true };
        const sort = { createAt: -1, updateAt: -1 };
        const pricedata = await PriceOracle.findOne(filter).sort(sort).select('price');
        if (pricedata) {
            return pricedata.price;
        }
        return 0;
    } catch (err) {
        return 0;
    }
}

module.exports = {
    getLatestCryptoPrice
}