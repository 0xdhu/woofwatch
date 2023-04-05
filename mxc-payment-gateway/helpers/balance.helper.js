const { ethers } = require('ethers');
const { token_decimal } = require('../config');
const { erc20, provider } = require('./token.contract.helper');

const { formatUnits, parseUnits } = ethers.utils;

const checkTokenBalance = async (address) => {
    if (address && address !== "") {
        const balance = formatUnits(await erc20.balanceOf(address), token_decimal);
        return parseFloat(balance);
    }
    return 0;
}

const formatWei = (amount) => parseUnits(amount, token_decimal);

// Get ETH balance of target address
const checkNativeBalance = async (address) => {
    const balanceInWei = await provider.getBalance(address);
    const balanceInEth = ethers.utils.formatEther(balanceInWei);
    return parseFloat(balanceInEth);
}

module.exports = {
    checkTokenBalance,
    checkNativeBalance,
    formatWei
}