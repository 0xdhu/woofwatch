/**
 * @dev Batch Transfer ETH to sub-wallets
 * @param { sub-wallets } subwallets
 */
const transferETHToSubWallet = async(parentSigner, subwallets) => {
    console.log("transferETHToSubWallet", subwallets)

    const len = subwallets.length;
    if (len <=0) {
        return false;
    }
    console.log("transferETHToSubWalletparentSigneraddress", parentSigner.address)
    // If parent wallet has no enough eth, failed
    const parentEthBalance = await checkNativeBalance(parentSigner.address);
    console.log("transferETHToSubWalletparentEthBalance", parentEthBalance)
    if (parentEthBalance < 0.001 * len + 0.01) {
        return false;
    }

    // Define gas fee amount
    const gasFeeAmount = ethers.utils.parseEther('0.001'); 
    const batchTx = new ethers.Batch();
    
    for(let i=0; i<len; i++) {
        const subwallet = subwallets[i];
        const { hdPath } = subwallet;

        // Create subwallet
        const subNode = rootNode.derivePath(hdPath);

        // Create BatchTransactions for each subNode
        const batchTransaction = new ethers.BatchTransaction();
        batchTransaction.add({
            to: subNode.address,
            value: gasFeeAmount,
        });
        batchTransaction.gasLimit = 21000;
        batchTransaction.gasPrice = ethers.utils.parseUnits('10', 'gwei');

        batchTx.add(batchTransaction);
    }

    const tx = await parentSigner.sendTransaction(batchTx);
    const receipt = await tx.wait();
    console.log("Receipt for transferETHToSubWallet", receipt);
    return true;
}

/**
 * @dev gather erc20 tokens from funded sub-wallets
 * @param {sub-wallets array} subwallets 
 */
const gatherTokenFromSubwallet = async (parent, fundedWallets) => {
    console.log("gatherTokenFromSubwallet", fundedWallets)

    const len = fundedWallets.length;
    if (len <=0) {
        return false;
    }
    const batch = new ethers.Batch();
    for(let i=0; i<len; i++) {
        const fundedWallet = fundedWallets[i];
        const { hdPath, payAmount } = fundedWallet;

        // Create subwallet
        const subwallet = rootNode.derivePath(hdPath);
        // Create Wallet instance for each subwallet
        const wallet = new ethers.Wallet(subwallet.privateKey);
        const tokenContract = erc20RW(wallet);

        // Create BatchTransactions for each subwallet
        const batchTransaction = new ethers.BatchTransaction();
        batchTransaction.add(tokenContract.transfer(parent, formatWei(payAmount)));
        batchTransaction.gasLimit = 100000;
        batch.add(batchTransaction);
    }

    const txBatch = await wallet.sendTransaction(batch);
    const erc20BatchReceipt = await txBatch.wait();
    console.log("Receipt for gatherTokenFromSubwallet", erc20BatchReceipt);
    return true;
}

const updateDocsAsWithdrawed = async (docs) => {
    try {
        // Create an array of update operations for each document
        const updateOperations = docs.map(doc => ({
            updateOne: {
                filter: { _id: doc._id }, // Update the document with this ID
                update: { $set: { status: 'payment.withdrawed' } }, // Set the "status" field to "payment.withdrawed"
            },
        }));
    
        if(await OrderHistory.bulkWrite(updateOperations)) {
            return true;
        }
    } catch (err) {
        return false;
    }
}