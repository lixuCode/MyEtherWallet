
module.exports = {
    getweb3: () => {
        let Web3 = require("web3")
        var web3 = new Web3(Web3.givenProvider || 'https://kovan.infura.io/v3/bc76cd31e8bf48f9a28b73770ffca805');
        
        return web3
    },

    success: (data) => {
        responseData = {
            code:0,
            status:"success",
            data:data
        }
        return responseData
    },

    fail: (msg) => {
        responseData = {
            code:1,
            status:"fail",
            msg:msg
        }
        return responseData
    }
}