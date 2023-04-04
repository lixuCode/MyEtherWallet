
function saveKeystoreNext() {
    $("#save-keystore").hide()
    $("#save-privatekey").show()
}

//通过私钥解锁账户
function unlockAccountWithPrivatekey() {
    let privatekey = $("#input-privatekey").val()
    console.log(privatekey)
    $.post("/unlock/private", `privatekey=${privatekey}`, function (res, status) {
        console.log(status + JSON.stringify(res))
        if (res.code == 0) {
            //将服务端返回的账户信息显示到页面
            //configAccountInfo(res.data)
        } 
    })
}

$(document).ready(function () {
    //改变了解锁账号的方式
    $("input[name=unlocktype]").change(function () {
        if (this.value == 1) {
            $("#unlock-account-privatekey").show()
            $("#unlock-account-keystore").hide()
            $("#unlock-account-mnemonic").hide()
        } else if (this.value == 2) {
            $("#unlock-account-privatekey").hide()
            $("#unlock-account-keystore").show()
            $("#unlock-account-mnemonic").hide()
        } else {
            $("#unlock-account-privatekey").hide()
            $("#unlock-account-keystore").hide()
            $("#unlock-account-mnemonic").show()
        }
    })
})    