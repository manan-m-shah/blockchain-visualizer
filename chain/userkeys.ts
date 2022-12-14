import EC from 'elliptic';
const ec = new EC.ec('secp256k1');

// Your private key goes here
export const myKey = ec.keyFromPrivate(
    '7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf'
);

// From that we can calculate your public key (which doubles as your wallet address)
export const myWalletAddress = myKey.getPublic('hex');

// generate keys for user1, user2 and user3
export const user1Key = ec.keyFromPrivate(
    '7x4x45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf'
);

export const user1WalletAddress = user1Key.getPublic('hex');

export const user2Key = ec.keyFromPrivate(
    '7y4y45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf'
);

export const user2WalletAddress = user2Key.getPublic('hex');

export const user3Key = ec.keyFromPrivate(
    '7z4z45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf'
);

export const user3WalletAddress = user3Key.getPublic('hex');
