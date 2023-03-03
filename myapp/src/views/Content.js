import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Web3 from 'web3'
import tokenjson from '../build/DanToken.json'
import exchangejson from '../build/Exchange.json'
import Order from './Order'
import Balance from './Balance'
import { loadBalanceData } from '../redux/slices/balanceSlice'
import { loadCancelOrderData, loadAllOrderData, loadFillOrderData } from '../redux/slices/orderSlice'


export default function Content() {
    const dispatch = useDispatch()
    useEffect(() => {
        async function start() {
           // 1.获取连接后的合约 
           const web = await initWeb()
           console.log(`web`, web)
           window.web = web
           // 2.获取资产信息
           dispatch(loadBalanceData(web))
           // 3.获取订单信息
           dispatch(loadCancelOrderData(web))
           dispatch(loadAllOrderData(web))
           dispatch(loadFillOrderData(web))
        }   
        start()
    }, [])
    async function initWeb() {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        let accounts = await web3.eth.requestAccounts();
        // 获取 networkID
        const networkId = await web3.eth.net.getId()
        
        const tokenabi = tokenjson.abi
        const tokenaddress = tokenjson.networks[networkId].address
        const token = await new web3.eth.Contract(tokenabi, tokenaddress)

        const exchangeabi = exchangejson.abi
        const exchangeaddress = exchangejson.networks[networkId].address
        const exchange = await new web3.eth.Contract(exchangeabi, exchangeaddress)

        return {
            web3,
            account: accounts[0],
            token,
            exchange
        }
    }
    return (
        <div style={{ padding: "10px" }}>
            <Balance></Balance>
            <Order></Order>
        </div>
    )
}