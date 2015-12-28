/**
 * This class requires the modules  and
 * 
 * no modi
 * 
 * @module renzheng
 */
var public_fun = require("./public_fun.js");

/**
 * 医生提交认证资料接口
 *
 * @service
 * @author YIYI
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function addDoctorRenzheng(arrData,fun){
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

    

    arrData.doctor_id = parseInt(arrData.doctor_id || 0);
    if(arrData.doctor_id == 0){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    arrData.addtime = public_fun.getTimeStamp();//添加时间
    arrData.edittime = public_fun.getTimeStamp();//修改时间

    new db.DoctorCertificate().query(function(qb){
        qb.where("doctor_id",arrData.doctor_id);
    }).fetchAll({columns:['id']}).then(function(data){
        data = data.toJSON();
        if(data.length > 0){
            res = {"code":40003,"msg":"数据已存在"};
            fun(JSON.stringify(res));
            return false;
        }else{
            new db.DoctorCertificate(arrData).save().then(function(model) {
                var dc_data = model.toJSON();
                console.log(dc_data);
                if(dc_data.id){
                    res = {"code":40000,"msg":"成功","renzheng_id":dc_data.id};
                }else{
                    res = {"code":40010,"msg":"失败"};
                }
                fun(JSON.stringify(res));
            });
        }
    });
}

/**
 * 医生修改认证资料接口
 *
 * @service
 * @author YIYI
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function editDoctorRenzheng(arrData,fun){
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

    var renzheng_id = parseInt(arrData.renzheng_id || 0);
    delete arrData.renzheng_id;
    if(renzheng_id == 0){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    arrData.doctor_id = parseInt(arrData.doctor_id || 0);
    if(arrData.doctor_id > 0){
        delete arrData.doctor_id;//医生id不能修改
    }
    arrData.edittime = public_fun.getTimeStamp();//修改时间

    new db.DoctorCertificate({id:renzheng_id}).save(arrData, {patch: true}).then(function(model) {
        var data = model.toJSON();
        console.log(data);
        if(data.id){
            res = {"code":40000,"msg":"成功","renzheng_id":data.id};
        }else{
            res = {"code":40010,"msg":"失败"};
        }
        fun(JSON.stringify(res));
    });
}
/**
 * 审核医生认证资料接口
 *
 * @service
 * @author YIYI
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function editRenzheng(arrData,fun){
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

    var renzheng_id = parseInt(arrData.renzheng_id || 0);
    delete arrData.renzheng_id;
    if(renzheng_id == 0){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    arrData.status = parseInt(arrData.status || 0);
    arrData.add_status_time = public_fun.getTimeStamp();//修改时间

    new db.DoctorCertificate({id:renzheng_id}).save(arrData, {patch: true}).then(function(model) {
        var data = model.toJSON();
        console.log(data);
        if(data.id){
            res = {"code":40000,"msg":"成功","renzheng_id":data.id};
        }else{
            res = {"code":40010,"msg":"失败"};
        }
        fun(JSON.stringify(res));
    });
}

/**
 * 获取医生认证列表接口
 *
 * @service
 * @author YIYI
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getRenzhengList(arrData,fun){
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret,page = arrData.page,pageCount=arrData.pageCount,requestData=arrData.requestData;
    
    //验证接口是否授权，密钥等信息
    var res = {};
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    page = parseInt(page || 1);
    pageCount = parseInt(pageCount || 10);
    var startnum = (page-1)*pageCount;
    requestData = requestData || [];
    var field = [],join="";
    join += " left join doctor_information d on d.id=dc.doctor_id ";
    if(requestData.length <= 0){
        requestData = ["doctor_id","doctor_name","renzheng_id","fazhengjiguan","qianfaren","zhengshubianma","fazhengriqi","type","zhengjian_pic_url","shenfenzheng","sfz_pic_url_zm","sfz_pic_url_fm","status","add_status_time"];
    }

    var add_field = true;
    requestData.forEach(function(v){
        add_field = true;
        if(v == "doctor_name"){
            field.push("d.yisheng as doctor_name");
            add_field = false;
        }
        if(v == "renzheng_id"){
            add_field = false;
            field.push("dc.id as renzheng_id");
        }
        if(add_field){
            field.push("dc."+v);
        }
    });

    field = field.join(",");

    var where = "1=1";
    if(!public_fun.isEmptyObject(arrData)){
        if(arrData.doctor_name){
            where += " AND d.yisheng LIKE '%"+arrData.doctor_name+"%'";
        }
        if(arrData.type){
            where += " AND dc.type = '"+arrData.type+"'" ;
        }
        if(arrData.status !== '' && arrData.status !== undefined){
            where += " AND dc.status = '"+arrData.status+"'" ;
        }
    }

    db.query('select count(1) num from doctor_certificate dc '+join+' where '+where).then(function(resp){
        var count_data= resp[0][0];
        var count = count_data.num;
        if(count) {
            var pageTotal = Math.ceil(count / pageCount);
            db.query('select '+field+' from doctor_certificate dc '+join+' where '+where+' limit '+ startnum + "," +pageCount).then(function(data) {
                var rows= data[0];
                if(rows.length > 0){
                    console.log(rows);
                    res = {"code":40000,"msg":"成功","count":count,"pageTotal":pageTotal,"data":rows};
                    fun(JSON.stringify(res));
                }else{
                    res = {"code":40001,"msg":"没有数据"};
                    fun(JSON.stringify(res));
                }
            });
        }else{
            res = {"code":40001,"msg":"没有数据"};
            fun(JSON.stringify(res));
        }
    });
    console.log(new Date().getTime());
}

/**
 * 获取医生认证信息接口
 *
 * @service
 * @author YIYI
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getRenzhengInfo(arrData,fun){
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret,renzheng_id = arrData.renzheng_id,doctor_id=arrData.doctor_id,requestData=arrData.requestData;
    //验证接口是否授权，密钥等信息
    var res = {};
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    var where = "1=1";

    renzheng_id = parseInt(renzheng_id || 0);
    doctor_id = parseInt(doctor_id || 0);
    if(renzheng_id == 0 && doctor_id==0){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    if(renzheng_id){
        where += " AND dc.id="+renzheng_id;
    }
    if(doctor_id){
        where += " AND dc.doctor_id="+doctor_id;
    }

    requestData = requestData || [];
    var field = [],join="";
    if(requestData.length <= 0){
        requestData = ["doctor_id","doctor_name","renzheng_id","fazhengjiguan","qianfaren","zhengshubianma","fazhengriqi","type","zhengjian_pic_url","shenfenzheng","sfz_pic_url_zm","sfz_pic_url_fm","status","add_status_time"];
    }

    var add_field = true;
    requestData.forEach(function(v){
        add_field = true;
        if(v == "doctor_name"){
            field.push("d.yisheng as doctor_name");
            add_field = false;
            join += " left join doctor_information d on d.id=dc.doctor_id ";
        }
        if(v == "renzheng_id"){
            add_field = false;
            field.push("dc.id as renzheng_id");
        }
        if(add_field){
            field.push("dc."+v);
        }
    });

    field = field.join(",");

    db.query('select '+field+' from doctor_certificate dc '+join+' where '+where).then(function(data) {
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
    console.log(Date.now());
}
