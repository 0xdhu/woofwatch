const { ethers } = require('ethers');

// Master wallet seed phrase
const ENV_SEED = process.env.MNEMONIC;

const isValidEVMAddress = (address) => {
    return address && ethers.utils.isAddress(address);
}

// Check mnemonic
const validateMnemonic = (mnemonic) => {
    if (!ENV_SEED && !mnemonic) {
        return "mnemonic required";
    }
    if (mnemonic && ethers.utils.isValidMnemonic(mnemonic) === false) {
        return "invalid mnemonice"
    }

    if (ENV_SEED && ethers.utils.isValidMnemonic(ENV_SEED) === false) {
        return "invalid mnemonice"
    }

    return "success"
}

const isValidEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};


module.exports = {
    isValidEVMAddress,
    validateMnemonic,
    isValidEmail
}