/**
 * New node file
 * 医生接口
 */
var db = require('node-db')().connect();
var public_fun = require("./public_fun.js");


/**
 * 获取医院医生列表接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getHospitalDoctorList(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret,page = arrData.page,pageCount=arrData.pageCount,requestData=arrData.requestData;

    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    page = parseInt(page || 1);
    pageCount = parseInt(pageCount || 10);
    var startnum = (page-1)*pageCount;

    arrData.hospital_id = arrData.hospital_id || 0;

    requestData = requestData || [];
    var field = [],jointable=[];
    jointable.push(" left join hospital h on h.id=hd.hospital_id ");
    jointable.push(" left join doctor_information d on d.id=hd.doctor_information_id ");
    if(requestData.length <= 0){
        requestData = ["doctor_id","old_id","doctor_name","hospital_id","hospital_name","zhuanchang","jianjie","telephone","work_num","doctor_code","is_show","is_list","status","sort","experience","record","is_roving","image","identity","research_area","domestic_position","domestic_title","provincial_title","international_title","pinyin","pinyin_full"];
    }

    var hd_field = ["hospital_id","work_num","doctor_code","is_show","is_list","status","sort"];
    var d_field = ["old_id","yisheng","zhuanchang","jianjie","telephone","experience","record","is_roving","image","identity","research_area","domestic_position","domestic_title","provincial_title","international_title","pinyin","pinyin_full"];
    var add_field = true,pre_field="";
    requestData.forEach(function(value){
        add_field = true;
        if(value == "doctor_id"){
            pre_field = "hd.";
            value="id as doctor_id";
        }
        if(value == "doctor_name"){
            value = "yisheng";
        }
        if(value == "hospital_name"){
            pre_field = "h.";
            value="name as hospital_name";
        }
        if(hd_field.indexOf(value) != -1){
            pre_field = "hd.";
        }
        if(d_field.indexOf(value) != -1){
            pre_field = "d.";
            if(value == "yisheng"){
                value="yisheng as doctor_name";
            }
        }
        if(add_field){
            field.push(pre_field+value);
        }
    });
    //console.log(field);console.log(jointable);console.log(other_data);return;
    field = field.join(",");
    jointable = jointable.join(" ");//console.log(field);console.log(jointable);console.log(other_data);return;
    var where = "1=1";
    if(arrData.hospital_id > 0){
        where += " AND h.id="+arrData.hospital_id;
    }
    arrData.doctor_name = (arrData.doctor_name || '').trim();
    if(arrData.doctor_name){
        where += " AND d.yisheng LIKE '%"+arrData.doctor_name+"%' ";
    }
    arrData.telephone = (arrData.telephone || '').trim();
    if(arrData.telephone){
        where += " AND d.telephone = '"+arrData.telephone+"' ";
    }
    arrData.work_num = (arrData.work_num || '').trim();
    if(arrData.work_num){
        where += " AND hd.work_num = '"+arrData.work_num+"' ";
    }
    arrData.doctor_code = (arrData.doctor_code || '').trim();
    if(arrData.doctor_code){
        where += " AND hd.doctor_code = '"+arrData.doctor_code+"' ";
    }
    arrData.is_list = parseInt(arrData.is_list || 0);
    if(arrData.is_list != 0){
        where += " AND hd.is_list = '"+arrData.is_list+"' ";
    }
    if(arrData.status !== undefined && arrData.status !== ''){
        where += " AND hd.status = '"+arrData.status+"' ";
    }
    arrData.is_show = parseInt(arrData.is_show || 0);
    if(arrData.is_show){
        where += " AND hd.is_show = '"+arrData.is_show+"' ";
    }
    arrData.is_roving = parseInt(arrData.is_roving || 0);
    if(arrData.is_roving){
        where += " AND d.is_roving = '"+arrData.is_roving+"' ";
    }
    arrData.identity = parseInt(arrData.identity || 0);
    if(arrData.identity){
        where += " AND d.identity = '"+arrData.identity+"' ";
    }

    db.query('select count(1) num from hospital_doctor hd '+jointable+' where '+where).then(function(resp) {
        var rows= resp[0][0];
        var count = rows.num;
        if(count){
            var pageTotal = Math.ceil(count/pageCount);
            db.query('select '+field+' from hospital_doctor hd '+jointable+' where '+where+' order by hd.id desc limit '+startnum+','+pageCount).then(function(data) {
                var datas= data[0];
                if(datas.length > 0){
                    console.log(datas);
                    res = {"code":40000,"msg":"成功","count":count,"pageTotal":pageTotal,"data":datas};
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
}

/**
 * 获取医生信息列表接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getDoctorInfoList(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret,page = arrData.page,pageCount=arrData.pageCount,requestData=arrData.requestData;

    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    page = parseInt(page || 1);
    pageCount = parseInt(pageCount || 10);
    var startnum = (page-1)*pageCount;

    requestData = requestData || [];
    var field = [];
    if(requestData.length <= 0){
        requestData = ["id","old_id","doctor_name","zhuanchang","jianjie","telephone","experience","record","is_roving","image","identity","research_area","domestic_position","domestic_title","provincial_title","international_title","pinyin","pinyin_full"];
    }

    requestData.forEach(function(value){
        if(value == "doctor_name"){
            value = "yisheng as doctor_name";
        }
        field.push(value);
    });
    field = field.join(",");
    var where = "1=1";
    arrData.doctor_name = (arrData.doctor_name || '').trim();
    if(arrData.doctor_name){
        where += " AND yisheng LIKE '%"+arrData.doctor_name+"%' ";
    }
    arrData.telephone = (arrData.telephone || '').trim();
    if(arrData.telephone){
        where += " AND telephone = '"+arrData.telephone+"' ";
    }
    arrData.is_roving = parseInt(arrData.is_roving || 0);
    if(arrData.is_roving){
        where += " AND is_roving = '"+arrData.is_roving+"' ";
    }
    arrData.identity = parseInt(arrData.identity || 0);
    if(arrData.identity){
        where += " AND identity = '"+arrData.identity+"' ";
    }

    db.query('select count(1) num from doctor_information where '+where).then(function(resp) {
        var rows= resp[0][0];
        var count = rows.num;
        if(count){
            var pageTotal = Math.ceil(count/pageCount);
            db.query('select '+field+' from doctor_information where '+where+' order by id desc limit '+startnum+','+pageCount).then(function(data) {
                var datas= data[0];
                if(datas.length > 0){
                    console.log(datas);
                    res = {"code":40000,"msg":"成功","count":count,"pageTotal":pageTotal,"data":datas};
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
}

/**
 * 根据医生id获取医生基本信息接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getHospitalDoctorInfo(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret,doctor_id = arrData.doctor_id,requestData=arrData.requestData;

    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    doctor_id = parseInt(doctor_id || 0);
    if(doctor_id == 0){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    requestData = requestData || [];
    var field = [],jointable=[];
    if(requestData.length <= 0){
        requestData = ["doctor_id","old_id","doctor_name","hospital_id","hospital_name","zhuanchang","jianjie","telephone","work_num","doctor_code","is_show","is_list","status","sort","experience","record","is_roving","image","identity","research_area","domestic_position","domestic_title","provincial_title","international_title","pinyin","pinyin_full"];
    }

    var hd_field = ["hospital_id","work_num","doctor_code","is_show","is_list","status","sort"];
    var d_field = ["old_id","yisheng","zhuanchang","jianjie","telephone","experience","record","is_roving","image","identity","research_area","domestic_position","domestic_title","provincial_title","international_title","pinyin","pinyin_full"];
    var add_field = true,pre_field="",other_data = {hospital:false,doctorinfo:false};
    requestData.forEach(function(value){
        add_field = true;
        if(value == "doctor_id"){
            pre_field = "hd.";
            value="id as doctor_id";
        }
        if(value == "doctor_name"){
            value = "yisheng";
        }
        if(value == "hospital_name"){
            pre_field = "h.";
            value="name as hospital_name";
            if(other_data.hospital == false){
                jointable.push(" left join hospital h on h.id=hd.hospital_id ");
            }
            other_data.hospital = true;
        }
        if(hd_field.indexOf(value) != -1){
            pre_field = "hd.";
        }
        if(d_field.indexOf(value) != -1){
            pre_field = "d.";
            if(other_data.doctorinfo == false){
                jointable.push(" left join doctor_information d on d.id=hd.doctor_information_id ");
            }
            other_data.doctorinfo = true;
            if(value == "yisheng"){
                value="yisheng as doctor_name";
            }
        }
        if(add_field){
            field.push(pre_field+value);
        }
    });
    //console.log(field);console.log(jointable);console.log(other_data);return;
    field = field.join(",");
    jointable = jointable.join(" ");//console.log(field);console.log(jointable);console.log(other_data);return;
    var where = "hd.id="+doctor_id;
    console.log(where);

    db.query('select '+field+' from hospital_doctor hd '+jointable+' where '+where).then(function(data) {
        var datas= data[0];console.log(datas);
        if(datas.length > 0){
            res = {"code":40000,"msg":"成功","data":datas[0]};
            fun(JSON.stringify(res));
        }else{
            res = {"code":40001,"msg":"没有数据"};
            fun(JSON.stringify(res));
        }
    });
    console.log(new Date().getTime());

}

/**
 * 根据医生id获取医生基本信息接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getDoctorInfo(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret,doctor_information_id = arrData.doctor_information_id,requestData=arrData.requestData;

    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    doctor_information_id = parseInt(doctor_information_id || 0);
    if(doctor_information_id == 0){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    requestData = requestData || [];
    var field = [];
    if(requestData.length <= 0){
        requestData = ["doctor_information_id","old_id","doctor_name","zhuanchang","jianjie","telephone","experience","record","is_roving","image","identity","research_area","domestic_position","domestic_title","provincial_title","international_title","pinyin","pinyin_full"];
    }
    requestData.forEach(function(value){
        if(value == "doctor_information_id"){
            value = "id as doctor_information_id";
        }
        if(value == "doctor_name"){
            value = "yisheng as doctor_name";
        }
        field.push(value);
    });
    //console.log(field);console.log(jointable);console.log(other_data);return;
    field = field.join(",");
    var where = "id="+doctor_information_id;

    db.query('select '+field+' from doctor_information where '+where).then(function(data) {
        var datas= data[0];console.log(datas);
        if(datas.length > 0){
            res = {"code":40000,"msg":"成功","data":datas[0]};
            fun(JSON.stringify(res));
        }else{
            res = {"code":40001,"msg":"没有数据"};
            fun(JSON.stringify(res));
        }
    });
    console.log(new Date().getTime());

}

/**
 * 添加医生信息接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function addDoctorInfo(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret;
    delete arrData.secret;

    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    arrData.yisheng = (arrData.yisheng || "").trim();
    if(arrData.yisheng == ""){
        res = {"code":40004,"msg":"缺少医生姓名"};
        fun(JSON.stringify(res));
        return false;
    }
    arrData.identity = parseInt(arrData.identity || 0);
    if(arrData.identity == 0){
        res = {"code":40004,"msg":"缺少身份标识"};
        fun(JSON.stringify(res));
        return false;
    }

    new db.DoctorInformation(arrData).save().then(function(model) {
        var data = model.toJSON();
        console.log(data);
        if(data.id){
            res = {"code":40000,"msg":"成功","doctor_information_id":data.id};
        }else{
            res = {"code":40010,"msg":"失败"};
        }
        fun(JSON.stringify(res));
    });
}

/**
 * 修改医生信息接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function editDoctorInfo(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret;
    delete arrData.secret;
    var doctor_information_id = arrData.doctor_information_id;
    delete arrData.doctor_information_id;

    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    doctor_information_id = parseInt(doctor_information_id || 0);
    if(doctor_information_id == 0){
        res = {"code":40004,"msg":"缺少医生信息id"};
        fun(JSON.stringify(res));
        return false;
    }
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
console.log("--------------");
    console.log(arrData);
    console.log(doctor_information_id);
    new db.DoctorInformation({id:doctor_information_id}).save(arrData, {patch: true}).then(function(model) {
        var data = model.toJSON();
        console.log(data);
        if(data.id){
            res = {"code":40000,"msg":"成功","doctor_information_id":data.id};
        }else{
            res = {"code":40010,"msg":"失败"};
        }
        fun(JSON.stringify(res));
    });
}

/**
 * 添加医院医生接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function addHospitalDoctor(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret;
    delete arrData.secret;

    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    arrData.hospital_id = parseInt(arrData.hospital_id || 0);
    if(arrData.hospital_id == ""){
        res = {"code":40004,"msg":"缺少医院id"};
        fun(JSON.stringify(res));
        return false;
    }
    arrData.doctor_information_id = parseInt(arrData.doctor_information_id || 0);
    if(arrData.doctor_information_id == 0){
        res = {"code":40004,"msg":"缺少医生信息id"};
        fun(JSON.stringify(res));
        return false;
    }
    arrData.addtime = public_fun.getTimeStamp();//添加时间

    new db.Doctor(arrData).save().then(function(model) {
        var data = model.toJSON();
        console.log(data);
        if(data.id){
            res = {"code":40000,"msg":"成功","doctor_id":data.id};
        }else{
            res = {"code":40010,"msg":"失败"};
        }
        fun(JSON.stringify(res));
    });
}

/**
 * 修改医院医生接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function editHospitalDoctor(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret;
    delete arrData.secret;
    var doctor_id = arrData.doctor_id;
    delete arrData.doctor_id;

    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    doctor_id = parseInt(doctor_id || 0);
    if(doctor_id == 0){
        res = {"code":40004,"msg":"缺少医院医生id"};
        fun(JSON.stringify(res));
        return false;
    }
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }

    new db.Doctor({id:doctor_id}).save(arrData, {patch: true}).then(function(model) {
        var data = model.toJSON();
        console.log(data);
        if(data.id){
            res = {"code":40000,"msg":"成功","doctor_id":data.id};
        }else{
            res = {"code":40010,"msg":"失败"};
        }
        fun(JSON.stringify(res));
    });
}

/**
 * 根据医生id获取医生职称信息接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getDoctorTitle(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret;
    delete arrData.secret;
    var doctor_id = arrData.doctor_id;
    delete arrData.doctor_id;

    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    doctor_id = doctor_id || [];
    if(doctor_id.length <= 0){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    var where = "hospital_doctor_id IN ("+doctor_id+")";

    db.query('select hospital_doctor_id doctor_id,hdt.id doctor_title_id,name title_name,hospital_title_id from hospital_doctor_title hdt left join hospital_title ht on ht.id=hdt.hospital_title_id where '+where).then(function(resp) {
        var rows= resp[0];console.log(rows);
        if(rows.length > 0){
            res = {"code":40000,"msg":"成功","data":rows};
            fun(JSON.stringify(res));
        }else{
            res = {"code":40001,"msg":"没有数据"};
            fun(JSON.stringify(res));
        }
    });

}

/**
 * 添加医生职称接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function addDoctorTitle(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret;
    delete arrData.secret;
    var hospital_doctor_id = arrData.hospital_doctor_id;
    var hospital_title_id = arrData.hospital_title_id;

    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    hospital_doctor_id = parseInt(hospital_doctor_id || 0);
    if(hospital_doctor_id == 0){
        res = {"code":40004,"msg":"缺少医院医生id"};
        fun(JSON.stringify(res));
        return false;
    }
    hospital_title_id = hospital_title_id || "";
    if(hospital_title_id == ""){
        res = {"code":40004,"msg":"缺少职称id"};
        fun(JSON.stringify(res));
        return false;
    }
    hospital_title_id = hospital_title_id.split(",");

    new db.HospitalTitle().query(function(qb){
        qb.where("id","IN",hospital_title_id);
    })
        .fetchAll({columns:["id"]})
        .then(function(host) {
            var data = host.toJSON();
            console.log(data);
            if(data.length > 0){
                var did = [];
                data.forEach(function(d){
                    did.push(d.id);
                });

                //验证数据是否已存在
                new db.HospitalDoctorTitle().query(function(qb){
                    qb.where("hospital_doctor_id",hospital_doctor_id);
                    qb.where("hospital_title_id","IN",did);
                }).fetchAll().then(function(hdt_data){
                    hdt_data = hdt_data.toJSON();
                    console.log(hdt_data);
                    if(hdt_data.length > 0){
                        hdd_data.map(function(hd,index){
                            did.map(function(aid,aindex){
                                if(aid == hd.hospital_title_id){
                                    did.splice(aindex,1);
                                }
                            });
                        });
                    }
                    if(did.length > 0){
                        var addsql = "INSERT INTO hospital_doctor_title(hospital_doctor_id,hospital_title_id,addtime) VALUES",
                            addval = [],
                            addtime = public_fun.getTimeStamp();
                        did.forEach(function (adid) {
                            addval.push("('" + hospital_doctor_id + "','" + adid + "','" + addtime + "')");
                        });
                        addval = addval.join(",");
                        addsql += addval;
                        console.log(addsql);
                        new db.query(addsql).then(function (addres) {
                            var addres = addres[0];
                            console.log("xxxxxxxxxxxxxxxxxxxx");
                            console.log(addres);
                            console.log(addres.affectedRows);
                            if(addres.affectedRows > 0){
                                res = {"code":40000,"msg":"成功"};
                                fun(JSON.stringify(res));
                            }else{
                                res = {"code":40010,"msg":"失败"};
                                fun(JSON.stringify(res));
                            }
                        });

                    }else{
                        res = {"code":40000,"msg":"成功"};
                        fun(JSON.stringify(res));
                    }
                });
            }else{
                res = {"code":40004,"msg":"职称不存在"};
                fun(JSON.stringify(res));
            }
        });
}
/**
 * 删除医生职称信息接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function delDoctorTitle(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret;
    delete arrData.secret;
    var hospital_title_id = arrData.hospital_title_id;
    var hospital_doctor_id = arrData.hospital_doctor_id;

    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    hospital_title_id = hospital_title_id || "";
    if(hospital_title_id == ""){
        res = {"code":40004,"msg":"缺少参数"};
        fun(JSON.stringify(res));
        return false;
    }

    hospital_title_id = hospital_title_id.split(",");

    hospital_doctor_id = parseInt(hospital_doctor_id || 0);
    if(hospital_doctor_id == 0){
        res = {"code":40004,"msg":"缺少参数"};
        fun(JSON.stringify(res));
        return false;
    }

    new db.HospitalDoctorTitle().query(function(qb){
        qb.where("hospital_title_id","IN",hospital_title_id);
        qb.where("hospital_doctor_id",hospital_doctor_id);
    }).destroy()
        .then(function(model) {
            var data = model.toJSON();
            console.log(data);
            if(public_fun.isEmptyObject(data)){
                res = {"code":40000,"msg":"成功"};
            }else{
                res = {"code":40010,"msg":"失败"};
            }
            fun(JSON.stringify(res));
        });
}


/**
 * 根据医生id获取医生科室信息接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getDoctorDepartment(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret;
    var doctor_id = arrData.doctor_id;
    var requestData = arrData.requestData;

    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    doctor_id = doctor_id || [];
    if(doctor_id.length <= 0){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    var where = "hospital_doctor_id IN ("+doctor_id+")";

    requestData = requestData || [];
    var field = [];
    if(requestData.length <= 0){
        requestData = ["doctor_id","doctor_department_id","hospital_department_id","hospital_id","department_one","department_two","pinyin_one","pinyin_two","pinyin_one_full","pinyin_two_full","telephone","dept_desc","dept_code","dept_location","sort_one","sort_two","is_recommend","is_show","general_department_id"];
    }

    var add_field = true,pre_field="";
    requestData.forEach(function(value) {
        add_field = true;
        if (value == "doctor_id") {
            pre_field = "hdd.";
            value = "hospital_doctor_id as doctor_id";
        }else if (value == "doctor_department_id"){
            pre_field = "hdd.";
            value = "id as doctor_department_id";
        }else if (value == "hospital_department_id") {
            pre_field = "hd.";
            value = "id as hospital_department_id";
        }else{
            pre_field = "hd.";
        }
        if(add_field){
            field.push(pre_field+value);
        }
    });

    db.query('select '+field+' from hospital_doctor_department hdd left join hospital_department hd on hd.id=hdd.hospital_department_id where '+where).then(function(resp) {
        var rows= resp[0];console.log(rows);
        if(rows.length > 0){
            res = {"code":40000,"msg":"成功","data":rows};
            fun(JSON.stringify(res));
        }else{
            res = {"code":40001,"msg":"没有数据"};
            fun(JSON.stringify(res));
        }
    });console.log(new Date().getTime());

}

/**
 * 添加医生科室接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function addDoctorDepartment(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret;
    var hospital_doctor_id = arrData.doctor_id;
    var hospital_department_id = arrData.hospital_department_id;

    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    hospital_doctor_id = parseInt(hospital_doctor_id || 0);
    if(hospital_doctor_id == 0){
        res = {"code":40004,"msg":"缺少医院医生id"};
        fun(JSON.stringify(res));
        return false;
    }
    hospital_department_id = hospital_department_id || "";
    if(hospital_department_id == ""){
        res = {"code":40004,"msg":"缺少科室id"};
        fun(JSON.stringify(res));
        return false;
    }
    hospital_department_id = hospital_department_id.split(",");

    new db.HospitalDepartment().query(function(qb){
        qb.where("id","IN",hospital_department_id);
    })
        .fetchAll({columns:["id"]})
        .then(function(host) {
            var data = host.toJSON();

            if(data.length > 0){console.log("-------------");
                var did = [];
                data.forEach(function(d){
                    did.push(d.id);
                });


                //验证数据是否已存在
                new db.HospitalDoctorDepartment().query(function(qb){
                    qb.where("hospital_doctor_id",hospital_doctor_id);
                    qb.where("hospital_department_id","IN",did);
                }).fetchAll().then(function(hdd_data){
                    hdd_data = hdd_data.toJSON();
                    console.log(hdd_data);
                    if(hdd_data.length > 0){
                        //console.log(hdd_data);console.log(did);
                        hdd_data.map(function(hd,index){
                            did.map(function(aid,aindex){
                                if(aid == hd.hospital_department_id){
                                    did.splice(aindex,1);
                                }
                            });
                        });
                        console.log("exist----------------");
                    }
                    console.log("didstart----------");
                    console.log(did);
                    console.log("didend----------");
                    if(did.length > 0) {
                        var addsql = "INSERT INTO hospital_doctor_department(hospital_doctor_id,hospital_department_id,addtime) VALUES",
                            addval = [],
                            addtime = public_fun.getTimeStamp();
                        did.forEach(function (adid) {
                            addval.push("('" + hospital_doctor_id + "','" + adid + "','" + addtime + "')");
                        });
                        addval = addval.join(",");
                        addsql += addval;
                        console.log(addsql);
                        new db.query(addsql).then(function (addres) {
                            var addres = addres[0];
                            console.log("xxxxxxxxxxxxxxxxxxxx");
                            console.log(addres);
                            console.log(addres.affectedRows);
                            if(addres.affectedRows > 0){
                                res = {"code":40000,"msg":"成功"};
                                fun(JSON.stringify(res));
                            }else{
                                res = {"code":40010,"msg":"失败"};
                                fun(JSON.stringify(res));
                            }
                        });
                    }
                    else{
                        res = {"code":40000,"msg":"成功"};
                        fun(JSON.stringify(res));
                    }
                });
            }else{
                res = {"code":40004,"msg":"科室不存在"};
                fun(JSON.stringify(res));
            }
        });
}
/**
 * 删除医生科室接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function delDoctorDepartment(arrData,fun){console.log("1111111111111");
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret;
    var hospital_department_id = arrData.hospital_department_id;
    var hospital_doctor_id = arrData.hospital_doctor_id;

    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }
    hospital_department_id = hospital_department_id || "";

    if(hospital_department_id == ""){
        res = {"code":40004,"msg":"缺少参数"};
        fun(JSON.stringify(res));
        return false;
    }

    hospital_department_id = hospital_department_id.split(",");

    hospital_doctor_id = parseInt(hospital_doctor_id || 0);

    if(hospital_doctor_id == 0){
        res = {"code":40004,"msg":"缺少参数"};
        fun(JSON.stringify(res));
        return false;
    }

    new db.HospitalDoctorDepartment().query(function(qb){
        qb.where("hospital_department_id","IN",hospital_department_id);
        qb.where("hospital_doctor_id",hospital_doctor_id);
    }).destroy()
        .then(function(model) {
            var data = model.toJSON();console.log(data);
            if(public_fun.isEmptyObject(data)){
                res = {"code":40000,"msg":"成功"};
            }else{
                res = {"code":40010,"msg":"失败"};
            }
            fun(JSON.stringify(res));
        });
}
