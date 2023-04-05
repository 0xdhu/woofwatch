const { createClient } = require('redis');
const { redis_url } = require('../config');
const { getTokenMetadata } = require('../helpers/token.contract.helper');

const getTokenInfo = async (req, res) => {
    let client;
    try {
        client = createClient(redis_url);
        await client.connect();

        const storedMetadata = await client.get("payment-token-metadaa");
        if (storedMetadata) {
            return res.status(200).send({
                code: 200,
                message: "success",
                data: JSON.parse(storedMetadata)
            });
        }

        const metadata = await getTokenMetadata();
        await client.set("payment-token-metadaa", JSON.stringify(metadata),'EX', 86400);

        return res.status(200).send({
            code: 200,
            message: "success",
            data: metadata
        });
    } catch (err) {
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

module.exports = {
    getTokenInfo
}