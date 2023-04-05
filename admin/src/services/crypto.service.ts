import { useQuery } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { cryptoGatewayUrl } from "./config"

// API
// This is for localStorage
export const adminTokenKey = "admin_token";

const apiClient = axios.create({
    baseURL: `${cryptoGatewayUrl}/api`,
    // withCredentials: true,
})
const adminClient = axios.create({
    baseURL: `${cryptoGatewayUrl}/admin`,
    // withCredentials: true,
})
const authClient = axios.create({
    baseURL: `${cryptoGatewayUrl}/auth`,
    // withCredentials: true,
})
const oracleClient = axios.create({
    baseURL: `${cryptoGatewayUrl}/oracle`,
    // withCredentials: true,
})


type TokenMetadata = {
    decimal: number,
    address: string,
    symbol: string,
    etherscan: string
} | null

type FundedWallet = {
    display_id: string,
    sub_wallet: string,
    created_at: string,
    customer: string,
    payment_status: string,
    pay_amount: number,
    order_id: string,
    total: string,
    fiat: string,
    product_items: Array<Record<string, any>>,
    action: string
}

type APIKey = {
    display_id: string,
    client_id: string,
    secret_key: string,
    action: string,
    createAt: string
}

type FundedWalletList = Array<FundedWallet> | null;
/**
 * Fetches token metadata
 */
export const getTokenMetadata =
    async (): Promise<TokenMetadata> => {
        const { data } = await apiClient.post("/token/metadata")
        const { code, data: metadata } = data;
        if (code === 200) {
            return metadata;
        }
        return null;
    }

/**
 * Fetches current stocks
 */
export const getCurrentStocks =
    async (): Promise<number> => {
        const { data } = await adminClient.post("/currentStocks")
        const { code, stocks } = data;
        if (code === 200) {
            return stocks;
        }
        return 0;
    }

/**
 * Fetches current stocks
 */
export const getTokenPrice =
    async (): Promise<number> => {
        const { data } = await oracleClient.post("/get_price")
        const { code, data: price } = data;
        if (code === 200) {
            return price;
        }
        return 0;
    }

/**
 * @dev send request to create sub-wallets
 */
export const sendRequestSubwalletsCreation =
    async (mnemonic: string, count: number): Promise<string> => {
        try {
            if (count === 0) {
                return "Count to create should not be zero.";
            }
            const postData = {
                mnemonic,
                subwalletCount: count
            }
            const token = await localStorage.getItem(adminTokenKey);
            if (!token || token === "") {
                return "Token does not exist. Please input your credential to get token";
            }

            const { data } = await adminClient.post("/subwallet/create", postData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const { message } = data;
            return message;
        } catch (err) {
            await localStorage.removeItem(adminTokenKey);
            return errorHandle(err);
        }
    }
/**
 * @dev send request to withdraw fund from sub-wallets
 */
export const sendRequestWithdrawFunds =
    async (mnemonic: string): Promise<string> => {
        try {
            const postData = { mnemonic }
            const token = await localStorage.getItem(adminTokenKey);
            if (!token || token === "") {
                return "Token does not exist. Please input your credential to get token";
            }

            const { data } = await adminClient.post("/withdraw/all", postData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const { message } = data;
            return message;
        } catch (err) {
            await localStorage.removeItem(adminTokenKey);
            return errorHandle(err);
        }
    }

/**
 * @dev send request to withdraw fund from sub-wallets
 */
export const sendRequestSingleWithdrawFunds =
    async (address: string, mnemonic?: string): Promise<string> => {
        try {
            const postData = { address, mnemonic }
            const token = await localStorage.getItem(adminTokenKey);
            if (!token || token === "") {
                return "Token does not exist. Please input your credential to get token";
            }

            const { data } = await adminClient.post("/withdraw/single", postData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const { message } = data;
            return message;
        } catch (err) {
            const errMsg = errorHandle(err);
            if (errMsg === "Invalid Token") {
                await localStorage.removeItem(adminTokenKey);
            }
        }
    }
/**
 * @dev send request to get accessToken
 */
export const sendRequestAccessToken =
    async (email: string, password: string): Promise<string> => {
        try {
            const authData = {
                email,
                password
            }

            const { data } = await authClient.post("/admin/signin", authData);
            const { code, message, data: tokenData } = data;
            if (code == 200 && tokenData) {
                const { token } = tokenData;
                await localStorage.setItem(adminTokenKey, token);
            }
            return message;
        } catch (err) {
            return errorHandle(err);
        }
    }
/**
 * Returns a string of form "abc...xyz"
 * @param {string} str string to string
 * @param {number} n number of chars to keep at front/end
 * @returns {string}
 */
export const getEllipsisTxt = (str: string, n = 6) => {
    if (str) {
        return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
    }
    return "";
};

/**
 * @dev Get funded wallets from database
 * @returns funded wallets
 */
const getFundedWalletList =
    async (): Promise<FundedWalletList> => {
        try {
            const { data } = await adminClient.post("/fundedOrders");
            const { data: docs } = data;
            const pd = docs.map((doc, idx) => {
                const { createAt, address, payAmount, intent_info, order_id } = doc;
                const { email, amount: fiat, currency, product_items } = intent_info;
                return {
                    order_id,
                    display_id: idx + 1,
                    sub_wallet: getEllipsisTxt(address),
                    created_at: createAt,
                    customer: email,
                    fiat: `${fiat} ${currency}`,
                    payment_status: `Funded`,
                    pay_amount: payAmount,
                    product_items,
                    total: `${addCommas(payAmount ?? 0)} MXC`,
                    action: { address, payAmount }
                }
            })
            return pd;
        } catch (err) {
            return null
        }
    }

/**
 * @dev Get api keys from database
 * @returns api keys
 */
const getApiKeyList =
    async (): Promise<Array<APIKey> | string> => {
        try {
            const token = await localStorage.getItem(adminTokenKey);
            if (!token || token === "") {
                return "InvalidToken";
            }

            const { data } = await authClient.post("/get/keyList", {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const { data: docs } = data;

            return docs.map((doc, idx) => {
                const { clientId, secretKey, createAt } = doc;
                return {
                    display_id: idx + 1,
                    client_id: clientId,
                    secret_key: secretKey,
                    created_at: createAt,
                    action: clientId
                }
            })
        } catch (err) {
            return "InvalidToken";
        }
    }


/**
 * @dev check error and return reason of error
 * @param error
 * @returns error_message
 */
const errorHandle = (error): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<Record<string, any>>;
        if (axiosError.response?.data.message)
            return (axiosError.response?.data.message);
        else return (axiosError.message);
    } else {
        return 'Network Error!';
    }
}

const metadataQueryKeys = ['token-metadata'];
const stocksQueryKeys = ['current-stocks'];
const fundedQueryKeys = ['funded-wallet'];
const apikeyQueryKeys = ['api-key'];
const erc20priceQueryKeys = ['token-price'];

export const useTokenMetadata = () => {
    return useQuery<TokenMetadata>(metadataQueryKeys, getTokenMetadata);
};

export const useCurrentStocks = () => {
    return useQuery<number>(stocksQueryKeys, getCurrentStocks);
};
export const useTokenPrice = () => {
    return useQuery<number>(erc20priceQueryKeys, getTokenPrice);
};
export const useFundedWalletList = () => {
    return useQuery<FundedWalletList>(fundedQueryKeys, getFundedWalletList);
};
export const useAPIKeyList = () => {
    return useQuery<Array<APIKey> | string>(apikeyQueryKeys, getApiKeyList);
};

// authentication
/**
 * @dev send request to create sub-wallets
 */
export const sendCredentialUpdates =
    async (currentEmail: string, currentPassword: string, newEmail: string, newPassword: string): Promise<string> => {
        try {
            if (currentEmail === "" || currentPassword === "" || newPassword === "") {
                return "Invalid parameter. Please check input values!";
            }

            const postData = {
                currentEmail,
                currentPassword,
                newEmail,
                newPassword
            }
            const { data } = await authClient.post("/admin/changeCredentials", postData);
            const { message } = data;
            return message;
        } catch (err) {
            return errorHandle(err);
        }
    }

/**
 * @dev send request to create new api key
 */
export const sendAPIKeyRequest =
    async (): Promise<string> => {
        try {
            const token = await localStorage.getItem(adminTokenKey);
            if (!token || token === "") {
                return "InvalidToken";
            }

            const { data } = await authClient.post("/create/apikey", {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const { message } = data;
            return message;
        } catch (err) {
            return errorHandle(err);
        }
    }

/**
 * @dev send request to create new api key
 */
export const sendAPIKeyDelete =
    async (clientId): Promise<string> => {
        try {
            const token = await localStorage.getItem(adminTokenKey);
            if (!token || token === "") {
                return "InvalidToken";
            }

            const { data } = await authClient.post("/delete/apikey", { clientId }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const { message } = data;
            return message;
        } catch (err) {
            return errorHandle(err);
        }
    }

/**
 * @dev send request to change oracle price
 */
export const sendPriceChange =
    async (price): Promise<string> => {
        try {
            const token = await localStorage.getItem(adminTokenKey);
            if (!token || token === "") {
                return "InvalidToken";
            }

            const { data } = await oracleClient.post("/set_price", { price }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const { message } = data;
            return message;
        } catch (err) {
            return errorHandle(err);
        }
    }

export function addCommas(number: number): string {
    const numberStr = number.toString();
    let output = '';

    for (let i = numberStr.length - 1; i >= 0; i--) {
        output = numberStr[i] + output;
        if ((numberStr.length - i) % 3 === 0 && i !== 0) {
            output = ',' + output;
        }
    }

    return output;
}