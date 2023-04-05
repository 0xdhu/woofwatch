const NewSubWallet = require("../models/NewSubWallet.model");
const PayIntent = require("../models/PayIntent.model");

const doExpireIntent = async(address) => {
    try {
        const filter = { address, status: "payment.waiting" };

        const updateIntent = { status: "payment.expired"};
        await PayIntent.findOneAndUpdate(filter, updateIntent);
        await NewSubWallet.findOneAndUpdate(filter, updateIntent)
        return true;
    } catch (err) {
        console.log(err)
        return false;
    }
}
const doCancelIntent = async(address, cancellation_reason, request_id) => {
    try {
        const filter = { address, status: "payment.waiting" };

        const updateIntent = { status: "payment.cancel", cancellation_reason, request_id};
        await PayIntent.findOneAndUpdate(filter, updateIntent);

        const update = { status: "empty" };

        await NewSubWallet.findOneAndUpdate(filter, update)
        return true;
    } catch (err) {
        console.log(err)
        return false;
    }
}
module.exports = {
    doExpireIntent,
    doCancelIntent
}