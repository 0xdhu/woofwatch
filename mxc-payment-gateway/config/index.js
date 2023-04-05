const token_address = process.env.TOKEN_ADDRESS;
const token_decimal = process.env.TOKEN_DECIMAL ?? 18;

const token_abi = [
    // Read-Only Functions
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",

    // Authenticated Functions
    "function transfer(address to, uint amount) returns (bool)",

    // Events
    "event Transfer(address indexed from, address indexed to, uint amount)"
];

const web3_rpc = process.env.APP_ENV == "production" ? `https://mainnet.infura.io/v3`: `https://sepolia.infura.io/v3`;
const provider_url = `${web3_rpc}/${process.env.INFURA_PROJECT_ID}`

const redis_url = process.env.REDIS_URL || "redis://localhost:6379";

module.exports = {
    token_address,
    token_decimal,
    token_abi,
    provider_url,
    redis_url
}