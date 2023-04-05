const mongoose = require("mongoose");
const { Schema } = mongoose;

// Defines the NewSubWallet schema
const NewSubWalletSchema = new Schema({
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
        type: String
    },
    intent_info: {
        type: Object
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
    updateAt: {
        type: Date,
        default: Date.now(),
    },
});

// Sets the createdAt parameter equal to the current time
NewSubWalletSchema.pre("save", (next) => {
    this.updateAt = Date.now();
    next();
});


const NewSubWallet = mongoose.model("NewSubWallet", NewSubWalletSchema);
module.exports = NewSubWallet;
