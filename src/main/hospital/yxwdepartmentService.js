/**
 * This class requires the modules  and
 * 
 * no modi
 * @module yxwdepartment
 */
var public_fun = require("./public_fun.js");


/**
 * 获取医享网通用科室接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData
 * @param {callback} fun - 回调方法
 */
function getYxwDepartment(arrData,fun){
    //验证接口是否授权，密钥等信息
    var res = {};
	
	arrData = JSON.parse(arrData);
	
	var secret = arrData.secret;
	var parent_name = arrData.parent_name;
    var parent_id = arrData.parent_id;
	var keshi_name = arrData.keshi_name;
	var status = arrData.status;
	var is_show = arrData.is_show;
	var requestData = arrData.requestData;
	
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    requestData = requestData || [];

    var where = " 1 = 1";
    if(parent_name){
        where += " AND pd.keshi_name LIKE '%"+parent_name+"%'";
    }
    if(typeof(parent_id)!=='undefined'){
        where += " AND d.parent_id = '"+parent_id+"'";
    }
    if(keshi_name){
        where += " AND d.keshi_name LIKE '%"+keshi_name+"%'" ;
    }
    if(status !== undefined && status !== ''){
        where += " AND d.status = '"+status+"'" ;
    }
    if(is_show){
        where += " AND d.is_show = '"+is_show+"'" ;
    }

    var field = [];
    if(requestData.length <= 0){
        requestData = ["id","keshi_name","parent_id","parent_name","pinyin","pinyin_full","status","sort","is_show"];
    }

    var add_field = true;
    requestData.forEach(function(v){
        add_field = true;
        if(v == "parent_name"){
            field.push("pd.keshi_name as parent_name");
            add_field = false;
        }
        if(add_field){
            field.push("d."+v);
        }
    });

    field = field.join(",");

    db.query('select '+field+' from yxw_general_department d left join yxw_general_department pd on pd.id=d.parent_id where '+where+' order by id asc ').then(function(data) {
        var rows= data[0];
        if(rows.length > 0){
            //console.log(rows);
            res = {"code":40000,"msg":"成功","data":rows};
            fun(JSON.stringify(res));
        }else{
            res = {"code":40001,"msg":"没有数据"};
            fun(JSON.stringify(res));
        }
    });
}

/**
 * 获取医享网通用科室所有一级科室接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData
 * @param {callback} fun - 回调方法
 */
function getYxwDepartmentOne(arrData,fun){
    //验证接口是否授权，密钥等信息
    var res = {};

    arrData = JSON.parse(arrData);

    var secret = arrData.secret;

    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    var where = " parent_id=0";
        //where += " AND status = '1'" ;
        where += " AND is_show = '1'" ;

    db.query('select id,keshi_name from yxw_general_department where '+where+' order by id asc ').then(function(data) {
        var rows= data[0];
        if(rows.length > 0){
            console.log(rows);
            res = {"code":40000,"msg":"成功","data":rows};
            fun(JSON.stringify(res));
        }else{
            res = {"code":40001,"msg":"没有数据"};
            fun(JSON.stringify(res));
        }
    });
}

/**
 * 根据id获取医享网通用科室信息接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -密钥
 * @param {callback} fun - 回调方法
 */
function getYxwDepartmentInfo(arrData,fun){
    //验证接口是否授权，密钥等信息
    var res = {};
	
	arrData = JSON.parse(arrData);
	
	var secret = arrData.secret;
	var yxw_department_id = arrData.yxw_department_id;
	var requestData = arrData.requestData;
	
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    yxw_department_id = parseInt(yxw_department_id || 0);
    if(yxw_department_id == 0){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }

    var where = "d.id="+yxw_department_id;

    requestData = requestData || [];
    var field = [];
    if(requestData.length <= 0){
        requestData = ["id","keshi_name","parent_id","parent_name","pinyin","pinyin_full","status","sort","is_show"];
    }

    var add_field = true;
    requestData.forEach(function(v){
        add_field = true;
        if(v == "parent_name"){
            field.push("pd.keshi_name as parent_name");
            add_field = false;
        }
        if(add_field){
            field.push("d."+v);
        }
    });

    field = field.join(",");

    db.query('select '+field+' from yxw_general_department d left join yxw_general_department pd on pd.id=d.parent_id where '+where).then(function(data) {
        var rows= data[0];
        if(rows.length > 0){
            console.log(rows);
            res = {"code":40000,"msg":"成功","data":rows};
            fun(JSON.stringify(res));
        }else{
            res = {"code":40001,"msg":"没有数据"};
            fun(JSON.stringify(res));
        }
    });
    console.log(new Date().getTime());
}
/**
 * 添加医享网通用科室接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -密钥
 * @param {callback} fun - 回调方法
 */
function addYxwDepartment(arrData,fun){
    //验证接口是否授权，密钥等信息
    var res = {};
	arrData = JSON.parse(arrData);
    arrData = arrData || {};
	var secret = arrData.secret;
	delete arrData.secret;
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }
	
    arrData.keshi_name = (arrData.keshi_name || "").trim();
    if(arrData.keshi_name == ""){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
	
    arrData.parent_id = parseInt(arrData.parent_id || 0);

    new db.YxwGeneralDepartment().query(function(qb){
        qb.where("keshi_name",arrData.keshi_name);
        qb.where("parent_id",arrData.parent_id);
    }).fetchAll({columns:['id']}).then(function(data){
        data = data.toJSON();
        if(data.length > 0){
            res = {"code":40003,"msg":"科室已存在"};
            fun(JSON.stringify(res));
            return false;
        }else{
            new db.YxwGeneralDepartment(arrData).save().then(function(model) {
                var hd_data = model.toJSON();
                console.log(hd_data);
                if(hd_data.id){
                    res = {"code":40000,"msg":"成功","yxw_department_id":hd_data.id};
                }else{
                    res = {"code":40010,"msg":"失败"};
                }
                fun(JSON.stringify(res));
            });
        }
    });
}

/**
 * 修改医享网通用科室信息接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -密钥
 * @param {callback} fun - 回调方法
 */
function editYxwDepartment(arrData,fun){
    //验证接口是否授权，密钥等信息
    var res = {};
	arrData = JSON.parse(arrData);
    arrData = arrData || {};
	var secret = arrData.secret;
	delete arrData.secret;
	
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    var yxw_department_id = parseInt(arrData.yxw_department_id || 0);
    delete arrData.yxw_department_id;
    if(yxw_department_id == 0){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    arrData.keshi_name = (arrData.keshi_name || '').trim();
    arrData.parent_id = parseInt(arrData.parent_id || 0);
    if(!arrData.keshi_name){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }

    new db.YxwGeneralDepartment().query(function(qb){
        qb.where("keshi_name",arrData.keshi_name);
        qb.where("parent_id",arrData.parent_id);
        qb.where("id","<>",yxw_department_id);
    }).fetchAll({columns:['id']}).then(function(data){
        data = data.toJSON();
        if(data.length > 0){
            res = {"code":40003,"msg":"科室已存在"};
            fun(JSON.stringify(res));
            return false;
        }else{
            new db.YxwGeneralDepartment({id:yxw_department_id}).save(arrData, {patch: true}).then(function(model) {
                var data = model.toJSON();
                console.log(data);
                if(data.id){
                    res = {"code":40000,"msg":"成功","yxw_department_id":data.id};
                }else{
                    res = {"code":40010,"msg":"失败"};
                }
                fun(JSON.stringify(res));
            });
        }
    });
}
