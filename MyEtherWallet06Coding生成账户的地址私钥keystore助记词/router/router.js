
let router = require("koa-router")()
let newAccountController = require("../controllers/newAccount")

router.get("/", async (ctx) => {
    //重定向
    ctx.response.redirect("/account/new.html")
})

//获取创建钱包账户的页面
router.get("/account/new.html", newAccountController.newAccountHtml)
//提交创建钱包账户的表单
router.post("/account/new", newAccountController.newAccount)

module.exports = router
