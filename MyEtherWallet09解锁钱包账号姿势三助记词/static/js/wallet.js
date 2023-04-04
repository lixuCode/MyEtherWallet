
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

//通过Keystore解锁账户
function unlockAccountWithKeystore() {
    var filedata = $("#unlock-accoutn-file").val()
    if (filedata.length <= 0) {
        alert("请选择文件!")
        return
    }
    //文件上传通过Formdata去储存文件的数据
    var data = new FormData()
    data.append("file", $("#unlock-accoutn-file")[0].files[0])
    data.append("password", $("#unlock-account-password").val())
    var urlStr = "/unlock/keystore"
    $.ajax({
        url: urlStr,
        type: "post",
        dataType: "json",
        contentType: false,
        data: data,
        processData: false,
        success: function (res, status) {
            console.log(status + JSON.stringify(res))
            if (res.code == 0) {
                //将服务端返回的账户信息显示到页面
                //configAccountInfo(res.data)
            } 
        },
        error: function (res, status) {
            alert(JSON.stringify(res)+status)
        }
    })
}

//通过助记词解锁账户
function unlockAccountWithMnemonic() {
    let mnemonic = $("#input-mnemonic").val()
    console.log(mnemonic)
    $.post("/unlock/mnemonic", `mnemonic=${mnemonic}`, function (res, status) {
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