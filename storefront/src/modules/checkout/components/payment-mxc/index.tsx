import React, { useEffect, useState } from 'react';
import { useCart } from "medusa-react"
import { getTokenPrice } from '@lib/mxc';
import ReceiverWallet from './receiver-wallet';
import TxProgress from './tx-progress';

const PaymentMxc: React.FC = () => {
    const { cart } = useCart()
    const [tokenPrice, setTokenPrice] = useState<number>(0);

    useEffect(() => {
        const getPrice = async () => {
            const price = await getTokenPrice();
            setTokenPrice(price);
        }
        getPrice();
    }, []);

    if (!cart?.id) {
        return (
            <div>
                Network Error
            </div>
        )
    }

    return (
      <div>
        <div className="flex w-full">
            { cart && cart.payment_session && <ReceiverWallet tokenPrice={tokenPrice} sessionData={ cart.payment_session.data }/> }
        </div>
        <div className="flex w-full">
            { cart && cart.payment_session && <TxProgress sessionData={ cart.payment_session.data } />}
        </div>
      </div>
    )
}
  
export default PaymentMxc
  