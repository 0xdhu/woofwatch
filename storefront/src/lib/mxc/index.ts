import { medusaClient } from "@lib/config";

/**
 * Fetches current price
 */
export const getTokenPrice =
    async (): Promise<number> => {
        const result = await medusaClient.client.request('GET', '/erc20-token/price');
        const { price } = result;
        return price;
    }

/**
 * Fetches current status
 */
export const getIntentStatus =
    async (address: string): Promise<string> => {
        const result = await medusaClient.client.request('GET', `/erc20-payment_intent/status?address=${address}`);
        const { status } = result;
        return status;
    }