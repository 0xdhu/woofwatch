import ipfilter from '@lib/util/ip-filter';
import { useState, useEffect } from 'react';

const blockedIPs = ['127.0.0.1', '192.168.1.1']

function useIpFilter(): [string] {
    const [ipStatus, setIpStatus] = useState<string>("none");

    useEffect(() => {
        async function getIp() {
            try {
                const response = await ipfilter();
                if (!response || blockedIPs.includes(response)) {
                    setIpStatus("denied");
                } else {
                    setIpStatus("allowed");
                }
            } catch (error) {
                setIpStatus("denied");
            }
        }
        getIp();
    }, []);

    return [ipStatus];
}

export default useIpFilter;