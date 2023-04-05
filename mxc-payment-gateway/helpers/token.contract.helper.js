const { ethers } = require('ethers');
const { token_address, token_abi, provider_url } = require("../config/index");
const { ToAbbreviatedAddress } = require("./utils");
// Create an ethers provider

const provider = new ethers.providers.JsonRpcProvider(provider_url);
const erc20 = new ethers.Contract(token_address, token_abi, provider);

const erc20RW = (signer) => {
    return new ethers.Contract(token_address, token_abi, signer);
}

const getTokenMetadata = async () => {
    const decimal = await erc20.decimals();
    const symbol= await erc20.symbol();
    const etherscanURL = process.env.APP_ENV == "production" ? 
        `https://etherscan.io/token/${token_address}`: 
        `https://sepolia.etherscan.io/token/${token_address}`;
    const metadata = {
        decimal,
        symbol,
        address: ToAbbreviatedAddress(token_address),
        etherscan: etherscanURL
    }
    return metadata
}

module.exports = {
    erc20,
    erc20RW,
    provider,
    getTokenMetadata
}