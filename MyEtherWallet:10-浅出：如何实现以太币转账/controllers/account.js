let { success, fail } = require("../utils/myUtils")
let web3 = require("../utils/myUtils").getweb3()
let fs = require("fs")
let menmonicModel = require("../models/mnemonic")

//获取以太币余额
async function getAccountBalance(address) {
    let balance = await web3.eth.getBalance(address)
    return web3.utils.fromWei(balance, "ether")
}

//配置返回给前端的数据，包含以太币的数据，还会有Token的数据
async function setResponseData(account) {
    //获取账户余额
    let balance = await getAccountBalance(account.address)
    console.log(balance)

    let resData = success({
        balance: balance,
        address: account.address,
        privatekey: account.privateKey
    })

    //返回相应数据给前端
    return resData
}

module.exports = {
    unlockAccountWithPrivate: async (ctx) => {
        //１．获取私钥
        let privatekey = ctx.request.body.privatekey
        console.log(privatekey)
        //2.通过私钥解锁账户
        let account = web3.eth.accounts.privateKeyToAccount(privatekey)
        console.log(account)
        //３．将账户信息返回给前端
        ctx.body = await setResponseData(account)
    },

    unlockAccountWithKeystore: async (ctx) => {
        //1.　获取前端传递的数据，包括keystore、密码
        let password = ctx.request.body.password
        console.log(password)
        let keystore = ctx.request.files.file
        console.log(keystore)
        //2.读取缓存文件中ｋｅｙｓｔｏｒｅ的数据
        let keystoreData = fs.readFileSync(keystore.path, "utf8")
        console.log(keystoreData)
        //3. 通过keystore和密码解锁账户
        let account = web3.eth.accounts.decrypt(JSON.parse(keystoreData), password)
        console.log(account)
        //４．将账户信息返回给前端
        ctx.body = await setResponseData(account)
    },
    
    unlockAccountWithMnemonic: async (ctx) => {
        //１．获取助记词
        let mnemonic = ctx.request.body.mnemonic
        console.log("mnemonic:",mnemonic)

        //2.通过助记词获取私钥
        /*
        注意这里为了简化前端实现过程，故只获取了助记词的第一对公私钥，即"m/44'/60'/0'/0/0"，在实际开发工作中需枚举路径"m/44'/60'/0'/0/0"的最后一位0，可继续取值为0,1,2,3,4……
        */
        let privatekey = menmonicModel.getPrivatekeyWithMnemonic(mnemonic, "m/44'/60'/0'/0/0")
        console.log("私钥："+privatekey)

        //3.通过私钥解锁账户
        let account = web3.eth.accounts.privateKeyToAccount(privatekey)
        console.log("account:",account)
        
        //4．将账户信息返回给前端
        ctx.body = await setResponseData(account)
    },
}