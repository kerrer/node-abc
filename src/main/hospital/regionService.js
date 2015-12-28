/**
 * New node file
 * 省份接口
 */
var db = require('node-db')().connect();
var public_fun = require("./public_fun.js");

/**
 * 获取医院列表
 *
 * @service
 * @author ljx
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */


function getRegion(arrData,fun){
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret;
    delete arrData.secret;

	//验证接口是否授权，密钥等信息
	var res = {};
	res = public_fun.check_s(secret);
	if(res.code != 40000){
		fun(JSON.stringify(res));
		return false;
	}
	//定义使用的常量
	var field = ["region_id","parent_id","region_name","region_type"];

	//组装查询条件
	var where_arr = {};
	if(arrData.region_type>=0){
		where_arr.region_type = arrData.region_type;
	}else{
        res = {"code":40004,"msg":"缺少参数region_type"};
        fun(JSON.stringify(res));
        return false;
    }
	if(arrData.parent_id>=0){
		where_arr.parent_id = arrData.parent_id;
	}
    new db.YxwRegion().query(function(qb){
		qb.where(where_arr);
	}).fetchAll({columns:field}).then(function(host_region){
		var data = host_region.toJSON();
		if(data.length > 0){
			res = {"code":40000,"msg":"成功","data":data};
		}else{
			res = {"code":40001,"msg":"没有数据"};
		}
		fun(JSON.stringify(res));
	});
}