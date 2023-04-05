const mongoose = require("mongoose");
const { Schema } = mongoose;

// Defines the ClientKey schema
const ClientKeySchema = new Schema({
    clientId: {
        type: String,
        required: true,
        unique: { caseInsensitive: true },
    },
    secretKey: {
        type: String,
        required: true,
        unique: { caseInsensitive: true },
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


ClientKeySchema.pre("save", async function(next) {
    this.updateAt = Date.now();
    next();
});

// Customize a method to the schema to check if the document has expired
ClientKeySchema.methods.checkExpired = function() {
    const now = Date.now();
    const expirationTime = now - (30 * 60 * 1000); // 30 mins ago
    return this.createAt.getTime() < expirationTime;
};


const ClientKey = mongoose.model("ClientKey", ClientKeySchema);
module.exports = ClientKey;
