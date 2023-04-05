import {
    AbstractPaymentService, PaymentSessionStatus
} from "@medusajs/medusa"
import axios from "axios"
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import * as dotenv from 'dotenv'
dotenv.config()

/**
 * Options
 * clientId: string;
 * secretKey: string;
 * capture: boolean;
 * apiEndpoint: string;
 * webhookSecret: string
 */


class MxcErc20ProviderService extends AbstractPaymentService {
    static identifier = "mxc-erc20"

    /// "token to pass for API to create payment intent"
    /// Need to use cached token to prevent request token a lot
    bearer_token = ""

    constructor(_, options) {
        super(_, options)
        /**
         * Required mxc-erc20 options:
         *  {
         *    clientId: "mxc-erc20 client id", REQUIRED
         *    secretKey: "mxc-erc20 secret key", REQUIRED
         *    // Use this flag to capture payment immediately (default is false)
         *    capture: true
         *    apiEndpoint
         *  }
         */
        this.options_ = options
    }

    async getToken() {
        if (this.bearer_token && this.bearer_token !== "") {
            return this.bearer_token;
        }

        try {
            const loginURL = `${this.options_.apiEndpoint}/auth/apitoken/login`;
            const loginHeader = {
                "x-client-id": this.options_.clientId,
                "x-secret-key": this.options_.secretKey,
                "Content-Type": "application/json",
            };
            const loginRes = await axios.post(
                loginURL,
                {},
                {
                    headers: loginHeader,
                }
            );
            const token = loginRes.data.token;
            this.bearer_token = token;
            // Cache token for a while
            setTimeout(() => (this.bearer_token = ""), 20 * 60 * 1000);
            return token;
        } catch (err) {
            console.log("Get Token");
            return ""
        }
    }

    async getPrice() {
        try {
            const oracleURL = `${this.options_.apiEndpoint}/oracle/get_price`;
            const loginRes = await axios.post(
                oracleURL,
                {},
            );
            const { code, data: latestPrice } = loginRes.data;
            if (code === 200) {
                return latestPrice
            }

            return 0;
        } catch (err) {
            console.log("Get Token");
            return ""
        }
    }

    async getIntentStatus(address) {
        try {
            // STEP #1: Before retrieve a intent, should get authorized token first.
            const token = await this.getToken();
            const intentInfoURL = `${this.options_.apiEndpoint}/api/payment_intents/status`;
            const loginRes = await axios.post(
                intentInfoURL,
                { address }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const { data: intentInfo } = loginRes.data;
            return intentInfo.status
        } catch (err) {
            return "Internal Server Error"
        }
    }

    async retrieveIntentData(data) {
        const { address } = data

        const retrieveIntentUrl = `${this.options_.apiEndpoint}/api/payment_intents/getInfo`;
        const postData = {
            address
        }
        try {
            // STEP #1: Before retrieve a intent, should get authorized token first.
            const token = await this.getToken();

            // STEP #2: Retrieve a paymentIntent by the intentId
            const res = await axios.post(retrieveIntentUrl, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { data: intentData } = res.data;
            console.log("Retrive data", JSON.stringify(intentData));

            return intentData;
        } catch (err) {
            // Handle api error here
            throw err
        }
    }

    async getPaymentData(paymentSession) {
        const { data } = paymentSession
        try {
            return await this.retrieveIntentData(data);
        } catch (err) {
            // Handle api error here
            throw err
        }
    }

    async updatePaymentData(paymentSessionData, _data) {

        return paymentSessionData
    }

    async createPayment(context) {

        try {
            const { id: cart_id, email, items, context: cart_context, currency_code, amount, resource_id, customer } = context
            const product_items = items.map((item) => {
                const { title, thumbnail, description, unit_price, quantity, total } = item;
                return {
                    title, thumbnail, description, unit_price, quantity, total
                }
            })


            const data = {
                description:
                    cart_context.payment_description ?? "",
                amount: Math.round(amount) / 100,
                email,
                currency: currency_code.toLocaleUpperCase(),
                request_id: uuidv4(),
                merchant_order_id: uuidv4(),
                metadata: { cart_id, resource_id },
                product_items,
                capture_method: this.options_.capture ? "automatic": "manual",
            }

            const createIntentUrl = `${this.options_.apiEndpoint}/api/payment_intents/create`;
            const token = await this.getToken();
            
            const res = await axios.post(
                createIntentUrl,
                JSON.stringify({
                    intent_info: data
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { data: session_data } = res.data;

            return {
                session_data,
                update_requests: customer?.metadata?.mxc_erc20_id ? undefined : {
                    customer_metadata: {
                        mxc_erc20_id: data.customer_id
                    }
                }
            }

        } catch (err) {
            console.log(err)
            throw new Error("CreatePayment has issue.")
        }
    }

    async retrievePayment(paymentData) {
        console.log("retrievePayment ==>")

        try {
            return await this.retrieveIntentData(paymentData);
        } catch (err) {
            // Handle api error here
            throw err
        }
    }

    async updatePayment(paymentSessionData, _cart) {
        return paymentSessionData
    }

    async authorizePayment(paymentSession, _context) {

        const stat = await this.getStatus(paymentSession.data)

        return { data: paymentSession.data, status: stat }
    }

    async capturePayment(payment) {
        await this.updateOrderInCryptoPaymentGateway(payment);
        return payment.data;
    }

    // To show order detail page from crypto management panel,
    // need to update order id. This would be used to verify transaction later.
    async updateOrderInCryptoPaymentGateway(payment) {
        try {
            const { order_id, id: pay_id, data } = payment;
            const { address } = data;
            const updateOrderUrl = `${this.options_.apiEndpoint}/api/order_history/update`;

            const token = await this.getToken();
            if (!token || token === "") {
                throw new Error("GetToken issue.")
            }

            await axios.post(
                updateOrderUrl,
                JSON.stringify({
                    address,
                    order_id,
                    pay_id
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (err) {
            console.log("UpdateOrderInCryptoPaymentGateway", err);
        }
    }

    async refundPayment(payment, refundAmount) {
        try {
            return payment.data
        } catch (err) {
            throw err
        }
    }

    async cancelPayment(payment) {

        const { address } = payment.data
        try {
            const cancelOrderUrl = `${this.options_.apiEndpoint}/api/payment_intents/cancel`;

            const token = await this.getToken();
            if (!token || token === "") {
                throw new Error("GetToken issue.")
            }

            return await axios.post(
                cancelOrderUrl,
                JSON.stringify({
                    address,
                    "cancellation_reason": "Order cancelled",
                    request_id: uuidv4(),
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            console.log(error)
            if (error.payment_intent.status === "CANCELLED") {
                return error.payment_intent
            }
            throw error
        }
    }
    async deletePayment(paymentSession) {
        const { address } = paymentSession.data
        try {
            const cancelOrderUrl = `${this.options_.apiEndpoint}/api/payment_intents/cancel`;

            const token = await this.getToken();
            if (!token || token === "") {
                throw new Error("GetToken issue.")
            }

            await axios.post(
                cancelOrderUrl,
                JSON.stringify({
                    address,
                    "cancellation_reason": "Order cancelled",
                    request_id: uuidv4(),
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (err) {
            console.log(err)
            throw new Error("DeletePayment issue.")
        }
    }
    async getStatus(data) {
        try {
            const { address } = data;
            // STEP #1: Before retrieve a intent, should get authorized token first.
            const intentStatus = await this.getIntentStatus(address);

            switch (intentStatus) {
                case "payment.waiting":
                    return PaymentSessionStatus.PENDING
                case "payment.fundminus":
                    return PaymentSessionStatus.REQUIRES_MORE
                case "empty":
                case "payment.expired":
                case "payment.cancel":
                    return PaymentSessionStatus.CANCELED
                case "payment.withdrawed":
                case "payment.funded":
                    return PaymentSessionStatus.AUTHORIZED
                default:
                    return PaymentSessionStatus.PENDING
            }
        } catch (err) {
            // Handle api error here
            return PaymentSessionStatus.PENDING
        }
    }


    /**
     * Constructs Stripe Webhook event
     * @param {object} data - the data of the webhook request: req.body
     * @param {object} signature - the Stripe signature on the event, that
     *    ensures integrity of the webhook event
     * @return {object} Stripe Webhook event
     */
    constructWebhookEvent(data, signature, policy) {
        const secret = this.options_.webhookSecret;
        const signatureHex = crypto.createHmac('sha256', secret).update(policy).digest('hex');
        if (signatureHex === signature) {
            return data;
        } else {
            throw new Error("failed to verify webhook signature.")
        }
    }
}

export default MxcErc20ProviderService