const mongoose = require("mongoose");
const { Schema } = mongoose;

// Defines the PayIntent schema
const PayIntentSchema = new Schema({
    address: {
        type: String,
        required: true,
        unique: { caseInsensitive: true }
    },
    status: {
        type: String
    },
    // Please check IntentInfo.md
    intent_info: {
        type: Object
    },
    clientId: {
        type: String,
        required: true,
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
PayIntentSchema.pre("save", (next) => {
    this.updateAt = Date.now();
    next();
});

// Customize a method to the schema to check if the document has expired
PayIntentSchema.methods.checkExpired = function() {
    const expirationTime = new Date().getTime() - (2 * 60 * 60 * 1000); // 2 hours ago
    return this.createAt.getTime() < expirationTime;
};

const PayIntent = mongoose.model("PayIntent", PayIntentSchema);
module.exports = PayIntent;
