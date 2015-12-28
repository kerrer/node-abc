/**
 * This class requires the modules  and
 * 
 * @module department
 */

var public_fun = require("./public_fun.js");


/**
 * 根据医院id获取医院科室列表接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -密钥
 * @param {callback} cb - 回调方法
 */
function getHospitalDepartment(arrData,cb){
	arrData = JSON.parse(arrData);
    //验证接口是否授权，密钥等信息
    var res = {};
	var secret = arrData.secret;console.log(arrData);
	var requestData = arrData.requestData;
	var page = arrData.page;
	var pageCount = arrData.pageCount;
	var hospital_id = arrData.hospital_id;
	var department_one = arrData.department_one;
	var department_two = arrData.department_two;
	var dept_code = arrData.dept_code;
	var is_recommend = arrData.is_recommend;
	var is_show = arrData.is_show;
		
    res = public_fun.check_s(secret);
    if(res.code != 40000){
       return cb(null,JSON.stringify(res));
    }
	
    page = parseInt(page || 1);
    pageCount = parseInt(pageCount || 10);
    var startnum = (page-1)*pageCount;
    //whereArr = whereArr || {};
    requestData = requestData || [];

    hospital_id = parseInt(hospital_id || 0);
    if(hospital_id == 0){
        res = {"code":40004,"msg":"缺少医院id"};
        return cb(null,JSON.stringify(res));
    }
    var where = " hospital_id = "+hospital_id;
    if(department_one){
        where += " AND department_one LIKE '%"+department_one+"%'";
    }
    if(department_two){
        where += " AND department_two LIKE '%"+department_two+"%'" ;
    }
    if(dept_code){
        where += " AND department_two = '"+dept_code+"'" ;
    }
    if(is_recommend){
        where += " AND is_recommend = '"+is_recommend+"'" ;
    }
    if(is_show){
        where += " AND is_show = '"+is_show+"'" ;
    }

    var field = [],join="";
    if(requestData.length <= 0){
        requestData = ["hospital_id","hospital_department_id","department_one","department_two","pinyin_one","pinyin_two","pinyin_one_full","pinyin_two_full","telephone","dept_desc","dept_code","dept_location","sort_one","sort_two","is_recommend","is_show","general_department_id"];
    }

    var add_field = true;
    requestData.forEach(function(v){
        add_field = true;
        if(v == "hospital_department_id"){
            field.push("id as hospital_department_id");
            add_field = false;
        }
        if(add_field){
            field.push(v);
        }
    });

    field = field.join(",");

    db.query('select count(1) num from hospital_department where '+where).then(function(resp){
        var count_data= resp[0][0];
        var count = count_data.num;
        if(count) {
            var pageTotal = Math.ceil(count / pageCount);
            db.query('select '+field+' from hospital_department where '+where+' order by id desc limit '+ startnum + "," +pageCount).then(function(data) {
                var rows= data[0];
                if(rows.length > 0){
                    console.log(rows);
                    res = {"code":40000,"msg":"成功","count":count,"pageTotal":pageTotal,"data":rows};
                    return cb(null,JSON.stringify(res));
                }else{
                    res = {"code":40001,"msg":"没有数据"};
                    return cb(null,JSON.stringify(res));
                }
            });
        }else{
            res = {"code":40001,"msg":"没有数据"};
            return cb(null,JSON.stringify(res));
        }
    });
    console.log(new Date().getTime());
}

/**
 * 根据医院id获取医院所有一级科室列表接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -密钥
 * @param {callback} cb - 回调方法
 */
function getHospitalDepartmentOne(arrData,cb){
    arrData = JSON.parse(arrData);
    //验证接口是否授权，密钥等信息
    var res = {};
    var secret = arrData.secret;console.log(arrData);
    var hospital_id = arrData.hospital_id;

    res = public_fun.check_s(secret);
    if(res.code != 40000){
        return cb(null,JSON.stringify(res));
    }

    hospital_id = parseInt(hospital_id || 0);
    if(hospital_id == 0){
        res = {"code":40004,"msg":"缺少医院id"};
        return cb(null,JSON.stringify(res));
    }
    var where = " hospital_id = "+hospital_id;
        where += " AND is_show = '1'" ;

        db.query('select department_one from hospital_department where '+where+' group by department_one order by id desc ').then(function(data) {
            var rows= data[0];
            if(rows.length > 0){
                //console.log(rows);
                res = {"code":40000,"msg":"成功","data":rows};
                return cb(null,JSON.stringify(res));
            }else{
                res = {"code":40001,"msg":"没有数据"};
                return cb(null,JSON.stringify(res));
            }
        });
}

/**
 * 根据id获取医院科室信息接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -密钥
 * @param {callback} cb - 回调方法
 */
function getHospitalDepartmentInfo(arrData,cb){
    //验证接口是否授权，密钥等信息
    var res = {};
	arrData = JSON.parse(arrData);
	
	var secret = arrData.secret;
	var hospital_department_id = arrData.hospital_department_id;
	var requestData = arrData.requestData;
	
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        return cb(null,JSON.stringify(res));
    }
	
	
    hospital_department_id = parseInt(hospital_department_id || 0);
    if(hospital_department_id == 0){
        res = {"code":40004,"msg":"参数错误"};
        return cb(null,JSON.stringify(res));
    }

    var where = "id="+hospital_department_id;

    requestData = requestData || [];
    var field = [],join="";
    if(requestData.length <= 0){
        requestData = ["hospital_id","hospital_department_id","department_one","department_two","pinyin_one","pinyin_two","pinyin_one_full","pinyin_two_full","telephone","dept_desc","dept_code","dept_location","sort_one","sort_two","is_recommend","is_show","general_department_id"];
    }

    var add_field = true;
    requestData.forEach(function(v){
        add_field = true;
        if(v == "hospital_department_id"){
            field.push("id as hospital_department_id");
            add_field = false;
        }
        if(add_field){
            field.push(v);
        }
    });

    field = field.join(",");

    db.query('select '+field+' from hospital_department where '+where).then(function(data) {
        var rows= data[0];
        if(rows.length > 0){
            console.log(rows);
            res = {"code":40000,"msg":"成功","data":rows};
            return cb(null,JSON.stringify(res));
        }else{
            res = {"code":40001,"msg":"没有数据"};
            return cb(null,JSON.stringify(res));
        }
    });
    console.log(new Date().getTime());
}
/**
 * 添加医院科室接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -密钥
 * @param {callback} cb - 回调方法
 */
function addHospitalDepartment(arrData,cb){
    //验证接口是否授权，密钥等信息
    var res = {};
	
	arrData = JSON.parse(arrData);
	
	var saveArr = new Array();
	
	var secret = arrData.secret;
	var hospital_id = arrData.hospital_id;
	var department_one = arrData.department_one;
	var department_two = arrData.department_two;
	
	saveArr.telephone = arrData.telephone;
	saveArr.dept_desc = arrData.dept_desc;
	saveArr.dept_code = arrData.dept_code;
	saveArr.dept_location = arrData.dept_location;
	saveArr.sort_one = arrData.sort_one;
	saveArr.sort_two = arrData.sort_two;
	saveArr.is_recommend = arrData.is_recommend;
	saveArr.is_show = arrData.is_show;
	saveArr.general_department_id = arrData.general_department_id;
	
	
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        return cb(null,JSON.stringify(res));
    }

    //arrData = arrData || {};

    saveArr.hospital_id = parseInt(hospital_id || 0);
    if(hospital_id == 0){
        res = {"code":40004,"msg":"参数错误"};
        return cb(null,JSON.stringify(res));
    }
    saveArr.department_one = department_one || "";
    if(department_one == 0){
        res = {"code":40004,"msg":"参数错误"};
        return cb(null,JSON.stringify(res));
    }
    saveArr.department_two = department_two || "";
    if(department_two == 0){
        res = {"code":40004,"msg":"参数错误"};
        return cb(null,JSON.stringify(res));
    }
    saveArr.addtime = public_fun.getTimeStamp();//添加时间
    saveArr.edittime = public_fun.getTimeStamp();//修改时间

    new db.HospitalDepartment().query(function(qb){
        qb.where("hospital_id",hospital_id);
        qb.where("department_one",department_one);
        qb.where("department_two",department_two);
    }).fetchAll({columns:['id']}).then(function(data){
        data = data.toJSON();
        if(data.length > 0){
            res = {"code":40003,"msg":"科室已存在"};
            return cb(null,JSON.stringify(res));
        }else{
            new db.HospitalDepartment(saveArr).save().then(function(model) {
                var hd_data = model.toJSON();
                console.log(hd_data);
                if(hd_data.id){
                    res = {"code":40000,"msg":"成功","hospital_department_id":hd_data.id};
                }else{
                    res = {"code":40010,"msg":"失败"};
                }
                return cb(null,JSON.stringify(res));
            });
        }
    });
}

/**
 * 修改医院科室信息接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -密钥
 * @param {callback} cb - 回调方法
 */
function editHospitalDepartment(arrData,cb){
    //验证接口是否授权，密钥等信息
    var res = {};
	arrData = JSON.parse(arrData);
	
	var saveArr = new Array();
	var secret = arrData.secret;
	var hospital_department_id = arrData.hospital_department_id;
	var hospital_id = arrData.hospital_id;
	var department_one = arrData.department_one;
	var department_two = arrData.department_two;

	saveArr.telephone = arrData.telephone;
	saveArr.dept_desc = arrData.dept_desc;
	saveArr.dept_code = arrData.dept_code;
	saveArr.dept_location = arrData.dept_location;
	saveArr.sort_one = arrData.sort_one;
	saveArr.sort_two = arrData.sort_two;
	saveArr.is_recommend = arrData.is_recommend;
	saveArr.is_show = arrData.is_show;
	saveArr.general_department_id = arrData.general_department_id;
    saveArr.department_one = arrData.department_one;
    saveArr.department_two = arrData.department_two;
	
	
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        return cb(null,JSON.stringify(res));
    }

    //arrData = arrData || {};

    var hospital_department_id = parseInt(hospital_department_id || 0);

    if(hospital_department_id == 0){
        res = {"code":40004,"msg":"参数错误"};
        return cb(null,JSON.stringify(res));
    }
    if(!hospital_id || !department_one || !department_two){
        res = {"code":40004,"msg":"参数错误"};
        return cb(null,JSON.stringify(res));
    }
    saveArr.edittime = public_fun.getTimeStamp();//修改时间

    new db.HospitalDepartment().query(function(qb){
        qb.where("hospital_id",hospital_id);
        qb.where("department_one",department_one);
        qb.where("department_two",department_two);
        qb.where("id","<>",hospital_department_id);
    }).fetchAll({columns:['id']}).then(function(data){
        data = data.toJSON();
        if(data.length > 0){
            res = {"code":40003,"msg":"科室已存在"};
            return cb(null,JSON.stringify(res));
        }else{
            new db.HospitalDepartment({id:hospital_department_id}).save(saveArr, {patch: true}).then(function(model) {
                var data = model.toJSON();
                console.log(data);
                if(data.id){
                    res = {"code":40000,"msg":"成功","hospital_department_id":data.id};
                }else{
                    res = {"code":40010,"msg":"失败"};
                }
                return cb(null,JSON.stringify(res));
            });
        }
    });
}
