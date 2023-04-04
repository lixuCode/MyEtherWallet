let web3 = require("../utils/myUtils").getweb3()
let fs = require("fs")
let path = require("path")

module.exports = {
    //获取创建账号的页面
    newAccountHtml: async (ctx) => {
        await ctx.render("newaccount.html")
    },

    //创建账户的表单提交被触发的方法
    newAccount: async (ctx) => {
        console.log("password:", ctx.request.body.password)

        //1.创建钱包账号
        let account = web3.eth.accounts.create(ctx.request.body.password)
        console.log(account)

        //2.根据账号和密码生成keystore文件
        let keystore = account.encrypt(ctx.request.body.password)
        console.log(keystore)

        //3.将keysotr保存到文件
        let keystoreString = JSON.stringify(keystore)
        let time = new Date()
        let fileName = 'UTC--'+time.toISOString()+'--'+account.address.slice(2)
        console.log(fileName)
        let filePath = path.join(__dirname, "../static/keystore", fileName)
        fs.writeFileSync(filePath, keystoreString)
        
        //4.将账号信息返回给客户端
        await ctx.render("downloadkeystore.html", {
            "downloadurl":"/keystore/"+fileName,
            "privatekey":account.privateKey
        })
    }
}