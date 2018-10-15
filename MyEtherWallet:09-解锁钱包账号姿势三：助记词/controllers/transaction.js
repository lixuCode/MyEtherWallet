module.exports = {
    transactionHtml: async (ctx) => {
        await ctx.render("transaction.html")
    },
}