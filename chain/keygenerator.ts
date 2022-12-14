import { TransactionType } from './transaction';
'use strict';
import EC from 'elliptic';

// You can use any elliptic curve
const ec = new EC.ec('secp256k1');

// // Generate a new key pair and convert them to hex-strings
// const key = ec.genKeyPair();
// const publicKey = key.getPublic('hex');
// const privateKey = key.getPrivate('hex');

// // Print the keys to the console
// console.log();
// console.log(
//     'Your public key (also your wallet address, freely shareable)\n',
//     publicKey
// );

// console.log();
// console.log(
//     'Your private key (keep this secret! To sign transactions)\n',
//     privateKey
// );

export const generateKeys = () => {
    const key = ec.genKeyPair();
    const publicKey = key.getPublic('hex');
    const privateKey = key.getPrivate('hex');
    return { publicKey, privateKey };
}

export const getPublicKey = (privateKey: string) => {
    const key = ec.keyFromPrivate(privateKey);
    return key.getPublic('hex');
}

export const signNewTransaction = (privateKey: string, transaction: TransactionType) => {
    const key = ec.keyFromPrivate(privateKey);
    transaction.signTransaction(key);
}
