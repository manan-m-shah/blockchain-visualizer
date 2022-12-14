'use strict';
import crypto from 'crypto';
import EC from 'elliptic';
const ec = new EC.ec('secp256k1');

import { TransactionType } from "./transaction";

export type BlockType = {
    timestamp: number;
    transactions: TransactionType[];
    previousHash: string;
    getCurrentHash: () => string;
    calculateHash: () => string;
    mineBlock: (difficulty: number) => void;
    hasValidTransactions: () => boolean;
}

export const Block = (timestamp: number, transactions: TransactionType[], previousHash: string): BlockType => {
    let nonce: number = 0;
    let hash: string = '';

    const getCurrentHash = () => {
        return hash
    }

    const calculateHash = () => {
        return crypto.createHash('sha256').update(previousHash + timestamp + JSON.stringify(transactions) + nonce).digest('hex');
    }

    const mineBlock = (difficulty: number) => {
        while (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            nonce++;
            hash = calculateHash();
        }
        console.log('Block mined: ' + hash);
    }

    const hasValidTransactions = () => {
        for (const tx of transactions) {
            if (!tx.isValid()) {
                return false;
            }
        }
        return true;
    }

    return {
        timestamp,
        transactions,
        previousHash,
        getCurrentHash,
        calculateHash,
        mineBlock,
        hasValidTransactions
    }
}
