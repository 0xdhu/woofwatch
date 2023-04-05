const mongoose = require("mongoose");
const { Schema } = mongoose;

// Defines the PriceOracle schema of crypto
const PriceOracleSchema = new Schema({
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String, // EUR, USD
        default: "USD",
    },
    isValid: {
        type: Boolean
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
PriceOracleSchema.pre("save", (next) => {
    this.updateAt = Date.now();
    next();
});

// Customize a method to the schema to check if the document has expired
PriceOracleSchema.methods.checkExpired = function() {
    return !isValid;
};

const PriceOracle = mongoose.model("PriceOracle", PriceOracleSchema);
module.exports = PriceOracle;