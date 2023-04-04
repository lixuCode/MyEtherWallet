
let router = require("koa-router")()

router.get("/", async (ctx) => {
    await ctx.render("newaccount.html")
})

module.exports = router
