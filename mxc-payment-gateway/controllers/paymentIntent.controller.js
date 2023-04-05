/** NewSubWallet Model */
const { doCancelIntent } = require('../helpers/PaymentIntent.helper');
const NewSubWallet = require('../models/NewSubWallet.model');
const OrderHistory = require('../models/OrderHistory.model');
/** PayIntent Model */
const PayIntent = require('../models/PayIntent.model');

/**
 * @dev create payment.intent and return unique address
 * to receive payment
 * 
 * @param intent_info
 * @returns unique_address (string)
 */
const createIntent = async (req, res) => {
    try {
        const { clientId } = req;
        const { intent_info } = req.body;
        // store on mongodb
        // validate user (device, ip_address, email, domain_as_hook)
    
        const newSubWallet = await NewSubWallet.findOne({ status: "empty" }, 'address');
        if (!newSubWallet) {
            return "server is not ready to receive your funds";
        }
        const { address } = newSubWallet;

        const result0 = await newSubWallet.updateOne({ status: "payment.waiting" });
        const result1 = await PayIntent.create({
            address,
            status: "payment.waiting",
            intent_info,
            clientId,
            createAt: Date.now(),
            updateAt: Date.now()
        });

        if (result0 && result1) {
            const { status, createAt: created_at, updateAt: updated_at, address, intent_info} = result1;
            const { merchant_order_id, amount, metadata } = intent_info;
            return res.status(200).send({
                message: "success",
                data: {
                    id: result1._id,
                    status,
                    created_at,
                    updated_at,
                    address,
                    merchant_order_id, 
                    amount,
                    metadata
                }
            })
        } 
        return res.status(400).send({
            code: 400,
            message: "Transaction failed",
        })
    } catch (err) {
        return res.status(500).send({
            code: 500,
            message: "Internal server error",
        })
    }
}

const cancelIntent = async (req, res) => {
    const { address, cancellation_reason, request_id } = req.body;
    await doCancelIntent(address, cancellation_reason, request_id)
    return res.status(200).send({ code: 200, message: "success "});
}
/**
 * @dev get current intent status
 * @param {request body} req 
 */
const getIntentStatus = async (req, res) => {
    try {
        const { address } = req.body;
        // check payIntent and orderHistory model
        const payIntentDoc = await PayIntent.findOne({ address, status: "payment.awaiting" }).select('status');
        if (payIntentDoc) {
            return res.status(200).send({
                message: "success",
                data: payIntentDoc,
            })
        } 
        else {
            const orderDoc = await OrderHistory.findOne({ address }).select('status');
            if (orderDoc) {
                return res.status(200).send({
                    message: "success",
                    data: orderDoc,
                })
            } else {
                const emptyDoc = await NewSubWallet.findOne({ address }).select('status');
                return res.status(200).send({
                    message: "success",
                    data: emptyDoc,
                })
            }
        }
    } catch (err) {
        return res.status(500).send({
            message: "Internal server error",
        })
    }
}

/**
 * @dev get current intent data
 * @param {request body} req 
 */
const getIntentInfo = async (req, res) => {
    try {
        const { address } = req.body;
        // check payIntent and orderHistory model
        const payIntentDoc = await PayIntent.findOne({ address, status: "payment.awaiting" });
        if (payIntentDoc) {
            const { status, createAt: created_at, updateAt: updated_at, address, intent_info} = payIntentDoc;
            const { merchant_order_id, amount, metadata } = intent_info;

            return res.status(200).send({
                message: "success",
                data: {
                    id: payIntentDoc._id,
                    status,
                    created_at,
                    updated_at,
                    address,
                    merchant_order_id, 
                    amount,
                    metadata
                },
            })
        } 
        else {
            const orderDoc = await OrderHistory.findOne({ address });
            if (orderDoc) {
                const { status, createAt: created_at, updateAt: updated_at, address, intent_info} = orderDoc;
                const { merchant_order_id, amount, metadata } = intent_info;

                return res.status(200).send({
                    message: "success",
                    data: {
                        id: orderDoc._id,
                        status,
                        created_at,
                        updated_at,
                        address,
                        merchant_order_id, 
                        amount,
                        metadata
                    },
                })
            } else {
                const emptyDoc = await NewSubWallet.findOne({ address }).select('status');
                return res.status(200).send({
                    message: "success",
                    data: emptyDoc,
                })
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: "Internal server error",
        })
    }
}

const updateOrderInfo = async (req, res) => {
    try {
        const { address, pay_id, order_id } = req.body;
        const filter = { address, status: "payment.funded" }
        const update = { pay_id, order_id };
        await OrderHistory.findOneAndUpdate(filter, update)
        return res.status(200).send({
            code: 200,
            message: "success"
        })

    } catch (err) {
        return res.status(200).send({
            code: 500,
            message: "Internal server error"
        })
    }
}

module.exports = {
    createIntent,
    cancelIntent,
    getIntentStatus,
    getIntentInfo,
    updateOrderInfo
}