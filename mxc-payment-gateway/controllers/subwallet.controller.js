const { ethers } = require('ethers');
const { checkNativeBalance, formatWei } = require('../helpers/balance.helper');
const { erc20RW, provider } = require('../helpers/token.contract.helper');
const { isValidEVMAddress, validateMnemonic } = require('../helpers/validator.helper');
const NewSubWallet = require('../models/NewSubWallet.model');
const OrderHistory = require('../models/OrderHistory.model');

// Master wallet seed phrase
const masterWalletSeedPhrase = process.env.MNEMONIC;

// desired HD path
const hdPathPrefix= "m/44'/60'/0'/0/";

const MAX_NUM = 10000;
// Pass number of sub-wallets to create
const createSubwallet = async (req, res) => {
    try {
        const { mnemonic, subwalletCount} = req.body;

        // should not create lots of sub-wallets.
        if (subwalletCount <= 0 || subwalletCount > MAX_NUM) {
            return res.status(400).send({
                code: 400,
                message: `Too much request or zero request. MAX count is ${MAX_NUM}`
            })
        }
        
        const isValidMnemonic = validateMnemonic(mnemonic);
        if (isValidMnemonic !== "success") {
            return res.status(400).send({
                code: 400,
                message: isValidMnemonic
            })
        }

        const rootMnemonic = (mnemonic && mnemonic !== "")? mnemonic : masterWalletSeedPhrase;

        // Create a new ethers HDNode instance from the mnemonic
        const rootNode = ethers.utils.HDNode.fromMnemonic(rootMnemonic );

        // Get last index of sub-wallet
        const hdPathData = await NewSubWallet.aggregate().sort({ hdPathIndex: "desc"});
        const lastIndex = (hdPathData && hdPathData.length > 0)? hdPathData[0].hdPathIndex: 0;
        
        // Get parent wallet address
        const { address: parent } = rootNode;

        // Generate sub-wallets from the master wallet's extended key
        const subWallets = Array.from(Array(subwalletCount).keys()).map(countIndex => {
            const pathIndex = lastIndex + countIndex+1;
            const hdPath = `${hdPathPrefix}${pathIndex}`;
            // Derive a sub-wallet from the master wallet using the HD path
            const subNode = rootNode.derivePath(hdPath);
            
            const { address } = subNode;
            return {
                name: "",
                parent,
                address,
                hdPathIndex: pathIndex,
                hdPath,
                status: "empty"
            }
        });
        // Create an array of write operations
        const operations = subWallets.map(document => {
            return { insertOne: { document } };
        });

        await NewSubWallet.bulkWrite(operations);

        return res.status(200).send({
            code: 200,
            message: "success"
        })
    } catch (err) {
        return res.status(500).send({
            code: 500,
            message: "Internal server issue"
        })
    }
}

// Withdraw ERC20 tokens from subwallets
const withdrawAllFunds = async (req, res) => {
    try {
        const { address, mnemonic} = req.body;

        const isValidMnemonic = validateMnemonic(mnemonic);
        if (isValidMnemonic !== "success") {
            return res.status(400).send({
                code: 400,
                message: isValidMnemonic
            })
        }

        // Get parent node from mnemonice
        const rootMnemonic = (mnemonic && mnemonic !== "")? mnemonic : masterWalletSeedPhrase;
        const rootNode = ethers.utils.HDNode.fromMnemonic(rootMnemonic);
        const parent = rootNode.address;

        // Get subwallets that has got funded
        const filter = {
            address,
            status: "payment.funded",
            parent
        }
        const docs = await OrderHistory.find(filter).select('hdPath payAmount').limit(20);

        const doc_count = docs.length;
        if (doc_count > 0) {
            // Make transaction
            for (let i = 0; i < doc_count; i++) {
                const doc = docs[i];
                const { hdPath, payAmount } = doc;
        
                // distribute eth
                if (await transferETHToSubWallet(rootNode, hdPath)) {
                    // gather token
                    if(await gatherTokenFromSubwallet(rootNode, hdPath, payAmount)) {
                        await updateDocAsWithdrawed(doc);
                    }
                }
    
            }
            return res.status(200).send({
                code: 200,
                message: "success"
            })
        }

        return res.status(400).send({
            code: 400,
            message: "There is no account to withdraw or transaction failed"
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            code: 500,
            message: "Internal server error"
        })
    }
}

/**
 * @dev Batch Transfer ETH to sub-wallet
 * @param { rootNode, hdPath } 
 */
const transferETHToSubWallet = async(rootNode, hdPath) => {
    // Get parent signer
    const parentSigner = new ethers.Wallet(rootNode.privateKey, provider);
    console.log("transfer ETH to sub-wallet", parentSigner.address)

    // If parent wallet has no enough eth, failed
    const parentEthBalance = await checkNativeBalance(parentSigner.address);
    if (parentEthBalance < 0.005) {
        return false;
    }

    // Define gas fee amount
    const gasFeeAmount = ethers.utils.parseEther('0.001'); 

    // Create subwallet
    const subNode = rootNode.derivePath(hdPath);
    const recipientAddress = subNode.address;
    const subETHBalance = await checkNativeBalance(recipientAddress);
    if (subETHBalance >= 0.001) {
        return true;
    }

    const tx = await parentSigner.sendTransaction({
        to: recipientAddress,
        value: gasFeeAmount
    });
    
    const receipt = await tx.wait();
    // console.log("(transfer gas) Receipt for ${subAddress}:", receipt);
    return true;
}

/**
 * @dev gather erc20 tokens from funded sub-wallet
 * @param { rootNode, hdPath, payAmount } 
 */
const gatherTokenFromSubwallet = async (rootNode, hdPath, payAmount) => {
    // Create subwallet
    const subNode = rootNode.derivePath(hdPath);

    const parentAddress = rootNode.address;
    const subAddress = subNode.address;
    const subPrivateKey = subNode.privateKey;

    console.log("Gather token from sub-wallet ", subAddress);

    // Create Wallet instance for each subwallet
    const wallet = new ethers.Wallet(subPrivateKey, provider);
    const tokenContract = erc20RW(wallet);

    // Transaction
    const tx = await tokenContract.transfer(parentAddress, formatWei(payAmount.toString()));
    const erc20BatchReceipt = await tx.wait();

    // console.log(`(withdraw) Receipt for ${subAddress}:`, erc20BatchReceipt);
    return true;
}

const updateDocAsWithdrawed = async (doc) => {
    try {
        if(await doc.updateOne({ status: 'payment.withdrawed' })) {
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
}

// Get count of all sub-wallets "empty"
const getCurrentStocks = async (req, res) => {
    try {
        const filter = { status: "empty" };
        const counts = await NewSubWallet.countDocuments(filter);
        return res.status(200).send({
            code: 200,
            message: "success",
            stocks: counts
        })
    } catch (err) {
        return res.status(500).send({
            code: 500,
            message: err.message ?? "something went wrong"
        })
    }
}

// Get funded orders that has not been withdrawed yet
const getFundedOrders = async (req, res) => {
    try {
        const filter = { status: "payment.funded" };
        const docs = await OrderHistory.
            find(filter).
            sort({ createAt: -1 }).
            select('address payAmount createAt order_id intent_info').
            limit(50);
        return res.status(200).send({
            code: 200,
            message: "success",
            data: docs
        });
    } catch (err) {
        return res.status(500).send({
            code: 500,
            message: err.message ?? "something went wrong"
        })
    }
}

module.exports = {
    createSubwallet,
    withdrawAllFunds,
    getCurrentStocks,
    getFundedOrders
}