import { TransactionType } from './../chain/transaction';
import { BlockType } from '../chain/block';
import { BlockchainType } from './../chain/blockchain';
type State = {
    publicKey: string | null,
    privateKey: string | null,
    selectedAccount: string | null,
    blockchain: BlockchainType | null,
    activeBlock: BlockType | null,
    activeTransaction: TransactionType | null,
}

export enum ActionKind {
    SET_PUBLIC_KEY = "SET_PUBLIC_KEY",
    SET_PRIVATE_KEY = "SET_PRIVATE_KEY",
    SET_SELECTED_ACCOUNT = "SET_SELECTED_ACCOUNT",
    SET_BLOCKCHAIN = "SET_BLOCKCHAIN",
    SET_ACTIVE_BLOCK = "SET_ACTIVE_BLOCK",
    SET_ACTIVE_TRANSACTION = "SET_ACTIVE_TRANSACTION",
}

type Action = {
    type: ActionKind
    payload: any
}

export type { State, Action }
