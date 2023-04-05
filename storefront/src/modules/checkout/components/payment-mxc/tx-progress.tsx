import { useCheckout } from "@lib/context/checkout-context"
import Spinner from '@modules/common/icons/spinner';
import React, { useEffect, useState } from 'react';
import { getIntentStatus } from '@lib/mxc';

type TxProgressOption = {
    sessionData: Record<string, any>
}
const TxProgress: React.FC<TxProgressOption> = ({ sessionData, }) => {
    const [intentStatus, setIntentStatus] = useState<string>("payment.waiting");
    const { address } = sessionData;
    const { onPaymentCompleted } = useCheckout()

    useEffect(() => {
        const getIntentInfo = async () => {
            const status = await getIntentStatus(address);
            setIntentStatus(status);
            if (status === "payment.funded") {
                onPaymentCompleted();
                clearInterval(interval)
            }
        }
        
        const interval = setInterval(() => {
            getIntentInfo();
        }, 10000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    return (
        <div className="flex flex-row w-full justify-between">
            <div className='flex flex-col gap-y-1'>
                <label className="text-gray-700 text-small-regular mt-2">
                    Transaction status
                </label>
                { intentStatus === "payment.waiting" ? 
                    <div className='flex flex-row gap-x-2 justify-center items-center'>
                        <h3 className="text-base-semi font-semibold leading-none text-gray-900">
                            Awaiting deposit 
                        </h3> 
                        <Spinner />
                    </div> : 
                    <h3 className="text-base-semi font-semibold leading-none text-gray-900">
                        { intentStatus }
                    </h3> 
                }
            </div>
        </div>
    )
}
  
export default TxProgress
  