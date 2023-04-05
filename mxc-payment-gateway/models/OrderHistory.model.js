const mongoose = require("mongoose");
const { Schema } = mongoose;

// Defines the OrderHistory schema
const OrderHistorySchema = new Schema({
    name: {
        type: String
    },
    parent: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
        unique: { caseInsensitive: true }
    },
    hdPathIndex: {
        type: Number,
        required: true,
        unique: true
    },
    hdPath: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true
    },
    intent_info: {
        type: Object,
        required: true
    },
    payAmount: {
        type: Number,
        required: true
    },
    order_id: {
        type: String,
        default: ""
    },
    pay_id: {
        type: String,
        default: ""
    },
    crypto: {
        price: {
            type: Number,
            required: true
        },
        oracleTs: {
            type: Date,
            required: true
        },
        currency: {
            type: String
        }
    },
    hookCount: {
        type: Number
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    updateAt: {
        type: Date,
        default: Date.now,
    },
});

// Sets the createdAt parameter equal to the current time
OrderHistorySchema.pre("save", (next) => {
    this.updateAt = Date.now();
    next();
});

const OrderHistory = mongoose.model("OrderHistory", OrderHistorySchema);
module.exports = OrderHistory;
