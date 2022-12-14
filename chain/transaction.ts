'use strict';
import crypto from 'crypto';
import EC from 'elliptic';
const ec = new EC.ec('secp256k1');

export type TransactionType = {
    fromAddress: string | null;
    toAddress: string;
    amount: number;
    timestamp: number;
    signature: string;
    calculateHash: () => string;
    signTransaction: (signingKey: EC.ec.KeyPair) => void;
    isValid: () => boolean;
}

export const Transaction = (fromAddress: string | null, toAddress: string, amount: number): TransactionType => {
    const timestamp = Date.now();
    let signature: string = '';
    const calculateHash = () => {
        return crypto.createHash('sha256').update(fromAddress + toAddress + amount + timestamp).digest('hex');
    }

    const signTransaction = (signingKey: EC.ec.KeyPair) => {
        if (signingKey.getPublic('hex') !== fromAddress) {
            throw new Error('You cannot sign transactions for other wallets!');
        }
        const hashTx = calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        signature = sig.toDER('hex');
    }

    const isValid = () => {
        if (fromAddress === null) return true;
        if (!signature || signature.length === 0) {
            throw new Error('No signature in this transaction');
        }
        const publicKey = ec.keyFromPublic(fromAddress, 'hex');
        return publicKey.verify(calculateHash(), signature);
    }

    return {
        fromAddress,
        toAddress,
        amount,
        timestamp,
        signature,
        calculateHash,
        signTransaction,
        isValid
    }
}
