import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

const balanceSlice = createSlice({
    name: 'balance',
    initialState: {
        TokenWallet: "0", // wei 转换,需要字符串
        TokenExchange: "0",
        EtherWallet: "0",
        EtherExchange: "0"
    },
    reducers: {
        setTokenWallet(state, action) {
            state.TokenWallet = action.payload
        },
        setTokenExchange(state, action) {
            state.TokenExchange = action.payload
        },
        setEtherWallet(state, action) {
            state.EtherWallet = action.payload
        },
        setEtherExchange(state, action) {
            state.EtherExchange = action.payload
        },
    }
})

export const { setTokenWallet, setTokenExchange, setEtherWallet, setEtherExchange } = balanceSlice.actions;

export default balanceSlice.reducer

export const loadBalanceData = createAsyncThunk(
    "balance/fetchBalanceData",
    async (data, { dispatch }) => {
        const { web3, account, token, exchange } = data
        // 钱包的 token
        const tokenWallet = await token.methods.balanceOf(account).call()
        dispatch(setTokenWallet(tokenWallet))
        console.log(`tokenWallet`, tokenWallet)
        // 获取交易所的 token
        const tokenExchange = await exchange.methods.balanceOf(token.options.address, account).call()
        console.log(`tokenExchange`, tokenExchange)
        dispatch(setTokenExchange(tokenExchange))

        // 获取钱包 ether
        const EtherWallet = await web3.eth.getBalance(account)
        dispatch(setEtherWallet(EtherWallet))
        console.log(`EtherWallet`, EtherWallet)

        // 获取交易所的 ether
        const EtherExchange = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call()
        dispatch(setEtherExchange(EtherExchange))
        console.log(`EtherExchange`, EtherExchange)
    }
)