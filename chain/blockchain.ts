'use strict';
import crypto from 'crypto';
import EC from 'elliptic';
import { Block, BlockType } from './block';
import { Transaction, TransactionType } from './transaction';
const ec = new EC.ec('secp256k1');

const globalDifficulty = 2;

export type BlockchainType = {
    chain: BlockType[];
    difficulty: number;
    pendingTransactions: TransactionType[];
    miningReward: number;
    createGenesisBlock: () => BlockType;
    getLatestBlock: () => BlockType;
    minePendingTransactions: (miningRewardAddress: string) => void;
    addTransaction: (transaction: TransactionType) => void;
    getBalanceOfAddress: (address: string) => number;
    getAllTransactionsForWallet: (address: string) => TransactionType[];
    isChainValid: () => boolean;
}

export const Blockchain = (): BlockchainType => {
    const chain: BlockType[] = [];
    const difficulty: number = globalDifficulty;
    let pendingTransactions: TransactionType[] = [];
    const miningReward: number = 100;

    const createGenesisBlock = () => {
        return Block(Date.now(), [], '0');
    }

    chain.push(createGenesisBlock())

    const getLatestBlock = () => {
        return chain[chain.length - 1];
    }

    const minePendingTransactions = (miningRewardAddress: string) => {
        const rewardTx = Transaction(null, miningRewardAddress, miningReward);
        pendingTransactions.push(rewardTx);

        let block = Block(Date.now(), pendingTransactions, getLatestBlock().getCurrentHash());
        block.mineBlock(difficulty);
        console.log('Block successfully mined!');
        chain.push(block);
        pendingTransactions = [];
    }

    const addTransaction = (transaction: TransactionType) => {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address');
        }
        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to chain');
        }
        pendingTransactions.push(transaction);
    }

    const getBalanceOfAddress = (address: string) => {
        let balance = 0;
        for (const block of chain) {
            for (const transactions of block.transactions) {
                if (transactions.fromAddress === address) {
                    balance -= transactions.amount;
                }
                if (transactions.toAddress === address) {
                    balance += transactions.amount;
                }
            }
        }
        return balance;
    }

    const getAllTransactionsForWallet = (address: string) => {
        const txs: TransactionType[] = [];
        for (const block of chain) {
            for (const tx of block.transactions) {
                if (tx.fromAddress === address || tx.toAddress === address) {
                    txs.push(tx);
                }
            }
        }
        return txs;

    }

    const isChainValid = () => {
        const realGenesis = JSON.stringify(createGenesisBlock().getCurrentHash());
        const genesis = JSON.stringify(chain[0].getCurrentHash());
        if (realGenesis != genesis) {
            console.log('Genesis block is not valid');
            return false;
        }
        
        for (let i = 1; i < chain.length; i++) {
            const currentBlock = chain[i];
            const previousBlock = chain[i - 1];
            if (!currentBlock.hasValidTransactions()) {
                console.log(i, 'Current transactions are not valid');
                return false;
            }
            if (currentBlock.getCurrentHash() !== currentBlock.calculateHash()) {
                console.log(i, 'Current hash is not valid', currentBlock.getCurrentHash(), currentBlock.calculateHash());
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.getCurrentHash()) {
                console.log(i, 'Previous hash is not valid');
                return false;
            }
        }
        return true;
    }

    return {
        chain,
        difficulty,
        pendingTransactions,
        miningReward,
        createGenesisBlock,
        getLatestBlock,
        minePendingTransactions,
        addTransaction,
        getBalanceOfAddress,
        getAllTransactionsForWallet,
        isChainValid
    }

}
