import React, { useEffect, useState } from 'react';
import QrcodeAddress from './qrcode';
import CopyToClipboard from '../copy-to-clipboard';

type ReceiverWalletOption = {
    tokenPrice: number
    sessionData: Record<string, any>
}
const ReceiverWallet: React.FC<ReceiverWalletOption> = ({ tokenPrice, sessionData }) => {
    const { amount, address } = sessionData;

    if (tokenPrice <= 0) {
        return <div>Price is not correct</div>
    }

    return (
        <div className="flex flex-row w-full justify-between">
            <div className='flex flex-col gap-y-1'>
                <label className="text-gray-700 text-small-regular mt-2">
                    Amount
                </label>
                <h3 className="text-lg font-semibold leading-none text-gray-900">
                    { amount / tokenPrice } MXC
                </h3> 
                <label className="text-gray-700 text-small-regular mt-2">
                    To this address
                </label> 
                <h3 className="text-lg font-semibold leading-none text-gray-900">
                    <CopyToClipboard value={address} displayValue={address}/>
                </h3>
            </div>
            <div>
                <QrcodeAddress address={address} />
            </div>
        </div>
    )
}
  
export default ReceiverWallet
  