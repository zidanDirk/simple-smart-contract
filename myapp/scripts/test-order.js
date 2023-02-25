const DanToken = artifacts.require("DanToken.sol")
const Exchange = artifacts.require("Exchange.sol")
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

const fromWei = (bn) => {
    return web3.utils.fromWei(bn, "ether");
}

const toWei = (number) => {
    return web3.utils.toWei(number.toString(), "ether");
}

const wait = (second) => {
    const millseconds = second * 1000;
    return new Promise((resolve) => setTimeout(resolve, millseconds))
}

module.exports = async function(callback) {
    try {
        const danToken = await DanToken.deployed();
        const exchange = await Exchange.deployed();
        const accounts = await web3.eth.getAccounts();

        // 第一步 account0 ----> account1 10w danToken
        await danToken.transfer(accounts[1], toWei(100000), {
            from: accounts[0]
        })

        // 第二步 account0 -> 交易所存入 100 以太币
        await exchange.depositEther({
            from: accounts[0],
            value: toWei(100)
        })

        let res1 = await exchange.tokens(ETHER_ADDRESS, accounts[0]);
        console.log("account[0] 在交易所的以太币", fromWei(res1))

        // account0 交易所存入 100000 DWT
        await danToken.approve(exchange.address, toWei(100000), {
            from: accounts[0]
        })
        await exchange.depositToken(danToken.address, toWei(100000), {
            from: accounts[0]
        })

        let res2 = await exchange.tokens(danToken.address, accounts[0])
        console.log("account[0] 在交易所的 DWT", fromWei(res2))

        // account1 在交易所存入 50 以太币
        await exchange.depositEther({
            from: accounts[1],
            value: toWei(50)
        })
        let res3 = await exchange.tokens(ETHER_ADDRESS, accounts[1])
        console.log("account[1] 在交易所的以太币", fromWei(res3))

        // account1 在交易所存入 50000 DWT
        await danToken.approve(exchange.address, toWei(50000), {
            from: accounts[1]
        })
        await exchange.depositToken(danToken.address, toWei(50000), {
            from: accounts[1]
        })

        let res4 = await exchange.tokens(danToken.address, accounts[1])
        console.log("account[1] 在交易所的 DWT", fromWei(res4))

        let orderId = 0;
        let res;

        res = await exchange.makeOrder(danToken.address, toWei(1000), ETHER_ADDRESS, toWei(0.1), {
            from: accounts[0]
        })

        orderId = res.logs[0].args.id
        console.log("创建一个订单")
        await wait(1)

        // 取消订单
        res = await exchange.makeOrder(danToken.address, toWei(2000), ETHER_ADDRESS, toWei(0.2), {
            from: accounts[0]
        })

        orderId = res.logs[0].args.id

        await exchange.cancelOrder(orderId, { from: accounts[0] })
        console.log("取消一个订单")
        await wait(1)

        res = await exchange.makeOrder(
            danToken.address, toWei(3000),
            ETHER_ADDRESS, toWei(0.3),
            { from: accounts[0] }
        )

        orderId = res.logs[0].args.id

        await exchange.fillOrder(orderId, { from: accounts[1] })
        console.log("完成一个订单")

        console.log("account[0]- 在交易所的 DWT", fromWei(await exchange.tokens(danToken.address, accounts[0])))
        console.log("account[0]- 在交易所的以太币", fromWei(await exchange.tokens(ETHER_ADDRESS, accounts[0])))

        console.log("account[1]- 在交易所的 DWT", fromWei(await exchange.tokens(danToken.address, accounts[1])))
        console.log("account[1]- 在交易所的以太币", fromWei(await exchange.tokens(ETHER_ADDRESS, accounts[1])))

        console.log("account[2]- 在交易所的 DWT", fromWei(await exchange.tokens(danToken.address, accounts[2])))
        console.log("account[2]- 在交易所的以太币", fromWei(await exchange.tokens(ETHER_ADDRESS, accounts[2])))
    
    } catch(error) {
        console.log(error)
    }
    

    callback()
}