let { success, fail } = require("../utils/myUtils")
let web3 = require("../utils/myUtils").getweb3()

module.exports = {
    transactionHtml: async (ctx) => {
        await ctx.render("transaction.html")
    },
    
    sendTransaction: async (ctx) => {
        let { fromaddress, toaddress, number, privatekey } = ctx.request.body
        console.log(JSON.stringify(ctx.request.body))

        let nonce = await web3.eth.getTransactionCount(fromaddress)
        let gasPrice = await web3.eth.getGasPrice()
        let balance = await web3.utils.toWei(number)

        var rawTx = {
            nonce: nonce,
            gasPrice: gasPrice,
            to: toaddress,
            value: balance,
            data: '0x00'//转Token代币会用到的一个字段
        }
        //需要将交易的数据进行预估gas计算，然后将gas值设置到数据参数中
        let gas = await web3.eth.estimateGas(rawTx)
        rawTx.gas = gas

        var Tx = require('ethereumjs-tx');
        var tx = new Tx(rawTx);
        var privateKey = new Buffer(privatekey.slice(2), 'hex')
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
                    "blockHash":data.blockHash,
                    "transactionHash":data.transactionHash
                })
            } else {
                responseData = fail("交易失败")
            }
        })

        ctx.body = responseData
    },
}