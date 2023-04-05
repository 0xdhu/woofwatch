const { ethers } = require('ethers');

const ToAbbreviatedAddress = (address) => {
    // Normalize the address using ethers.utils.getAddress
    const normalizedAddress = ethers.utils.getAddress(address);

    // Extract the first and last characters of the address and concatenate them with the desired prefix and suffix
    const prefix = normalizedAddress.substring(0, 5);
    const suffix = normalizedAddress.substring(normalizedAddress.length - 3);
    const abbreviatedAddress = `${prefix}..${suffix}`;

    return abbreviatedAddress;
}

module.exports = {
    ToAbbreviatedAddress
}