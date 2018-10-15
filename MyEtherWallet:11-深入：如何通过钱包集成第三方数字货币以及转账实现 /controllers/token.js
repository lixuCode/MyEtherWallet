let myContract = require("../models/contract").getContract()
let web3 = require("../utils/myUtils").getweb3()
let {success, fail} = require("../utils/myUtils")

module.exports = {
    
    sendTokenTransaction: async (ctx) => {
        let { fromaddress, toaddress, number, privatekey } = ctx.request.body
        console.log(JSON.stringify(ctx.request.body))

        let nonce = await web3.eth.getTransactionCount(fromaddress)
        let gasPrice = await web3.eth.getGasPrice()

        let decimals = await myContract.methods.decimals().call()
        let balance = number * Math.pow(10, decimals)

        let myBalance = await myContract.methods.balanceOf(fromaddress).call()
        if (myBalance < balance) {
            ctx.body = fail("余额不足")
            return
        }
        let tokenData = await myContract.methods.transfer(toaddress, balance).encodeABI()

        var rawTx = {
            nonce: nonce,
            gasPrice: gasPrice,
            to: myContract.options.address,//如果转的是Token代币，那么这个to就是合约地址
            from: fromaddress,
            data: tokenData//转Token会用到的一个字段
        }
        //需要讲交易的数据进行预估Gas计算，然后将Gas值设置到数据参数中
        let gas = await web3.eth.estimateGas(rawTx)
        rawTx.gas = gas

        var Tx = require('ethereumjs-tx');
        var privateKey = new Buffer(privatekey.slice(2), 'hex')

        var tx = new Tx(rawTx);
        tx.sign(privateKey);

        var serializedTx = tx.serialize();

        let responseData;
        await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, data) {
            console.log(err)
            console.log(data)

            if (err) {
                responseData = fail(err)
            }
        })
        .then(function(data) {
            console.log(data)
            if (data) {
                responseData = success({
                    "transactionHash":data.transactionHash
                })
            } else {
                responseData = fail("交易失败")
            }
        })

        ctx.body = responseData
    }
}