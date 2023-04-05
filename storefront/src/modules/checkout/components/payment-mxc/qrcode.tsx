import React from 'react';
import QRCode from 'qrcode.react';

type QrcodeAddressOption = {
    address: string
}
const QrcodeAddress: React.FC<QrcodeAddressOption> = ({ address }) => {


    return (
        <div className="flex flex-col relative w-full pb-6">
            <div>
                <QRCode value={address} />
            </div>
        </div>
    )
}
  
export default QrcodeAddress
  