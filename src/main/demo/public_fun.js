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
/**
 * 数组去重
 *
 * @author YIYI
 * @param {array} arr -要去重的数组
 */
function array_unique(arr) {
    var n = {}, r = [];
    arr.forEach(function(v){
        if (!n[typeof(v) + v]) {
            n[typeof(v) + v] = true;
            r.push(v);
        }
    });
    return r;
}
exports.array_unique = array_unique;
/**
 * 判断空对象
 *
 * @author YIYI
 * @param {array} obj -要验证的对象
 */
function isEmptyObject(obj){
    for(var n in obj){return false;}
    return true;
}
exports.isEmptyObject = isEmptyObject;
/**
 * 获取当前时间戳
 *
 * @author YIYI
 */
function getTimeStamp(){
    var now_time = Date.now();//new Date().getTime();
    now_time = parseInt(now_time/1000,10);
    return now_time;
}
exports.getTimeStamp = getTimeStamp;
/**
 * 二维数组按某字段排序
 * 用法：array.sort(public_fun.getSortField('field', 'asc'));
 * @author zhoujf
 * @param field 排序的字段
 * @param order asc/desc 正序或者倒序
 */
function getSortField(field, order) {
    if(order === 'desc'){
		var sortFun = new Function('a', 'b', 'return b.' + field + '-' + 'a.' + field );
	}else{
		var sortFun = new Function('a', 'b', 'return a.' + field + '-' + 'b.' + field );
	}
    return sortFun;
}
exports.getSortField = getSortField;