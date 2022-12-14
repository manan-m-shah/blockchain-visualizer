import { getPublicKey, signNewTransaction } from './keygenerator';
'use strict';
import { Blockchain, BlockchainType } from './blockchain';
import { Transaction } from './transaction';


// Create new instance of Blockchain class
// const BITSChain = Blockchain();



// Mine first block
// BITSChain.minePendingTransactions(myWalletAddress);



// // Create a transaction & sign it with your key
// const tx1 = Transaction(myWalletAddress, user1WalletAddress, 100);
// tx1.signTransaction(myKey);
// BITSChain.addTransaction(tx1);

// // // Mine block
// BITSChain.minePendingTransactions(myWalletAddress);

export const createNewChain = () => {
    const newChain = Blockchain();
    return newChain;
}

export const createNewTransaction = (blockchain: BlockchainType, fromAddressPrivateKey: string, toAddress: string, amount: number) => {
    const fromAddress = getPublicKey(fromAddressPrivateKey);
    const newTransaction = Transaction(fromAddress, toAddress, amount);
    signNewTransaction(fromAddressPrivateKey, newTransaction);
    blockchain.addTransaction(newTransaction);
    blockchain.minePendingTransactions(fromAddress);
    console.log(blockchain)
    return newTransaction;
}

export const minePendingTransactions = (blockchain: BlockchainType, miningRewardAddress: string) => {
    blockchain.minePendingTransactions(miningRewardAddress);
}

// console.log();
// console.log('Blockchain valid?', BITSChain.isChainValid() ? 'Yes' : 'No');

// console.log();
// console.log('Tampering with chain...');
// BITSChain.chain[1].transactions[0].amount = 10;
// // Check if the chain is valid
// console.log('Blockchain valid?', BITSChain.isChainValid() ? 'Yes' : 'No');
