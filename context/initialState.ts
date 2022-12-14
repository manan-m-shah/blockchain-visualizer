import { State } from "../types/Context";

const initialState: State = {
    publicKey: null,
    privateKey: null,
    selectedAccount: null,
    blockchain: null,
    activeBlock: null,
    activeTransaction: null,
}

export default initialState