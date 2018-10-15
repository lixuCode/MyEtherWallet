
let router = require("koa-router")()
let newAccountController = require("../controllers/newAccount")
let trasactionConytoller = require("../controllers/transaction")
let accountController = require("../controllers/account")


router.get("/", async (ctx) => {
    //重定向
    ctx.response.redirect("/account/new.html")
})

//获取创建钱包账户的页面
router.get("/account/new.html", newAccountController.newAccountHtml)
//提交创建钱包账户的表单
router.post("/account/new", newAccountController.newAccount)

//获取转账的页面
router.get("/transaction.html", trasactionConytoller.transactionHtml)

//通过私钥解锁账户
router.post("/unlock/private", accountController.unlockAccountWithPrivate)

module.exports = router
