/**
 * 验证密钥规则
 *
 * @author YIYI
 * @param {string} secret -密钥
 */
function check_s(check_secret){
    var cres = {};
    check_secret = typeof check_secret !== "undefined" ? check_secret : "";
    if(!check_secret || check_secret != "yixiang2015"){
        cres = {"code":40008,"msg":"接口未授权"};
        return cres;
    }else{
        cres = {"code":40000,"msg":"授权成功"};
        return cres;
    }
}

exports.check_s = check_s;

