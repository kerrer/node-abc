/**
 * This class requires the modules  and
 * 
 * no modi
 * @module hospital
 */
var public_fun = require("./public_fun.js");

/**
 * 获取医院列表
 * @service
 * @author ljx
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */


function getHospitalList(arrData,fun){
    //验证接口是否授权，密钥等信息
    var res = {};

    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret,page = arrData.page,pageCount=arrData.pageCount,requestData=arrData.requestData;
    delete arrData.secret;


    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    page = typeof page !== "undefined" ? parseInt(page) : 1;
    pageCount = typeof pageCount !== "undefined" ? parseInt(pageCount) : 10;
    var startnum = (page-1)*pageCount;
    //whereArr = typeof whereArr !== "undefined" ? whereArr : [];
    requestData = typeof requestData !== "undefined" ? requestData : [];
    var field = [],related_table=[];
    if(requestData.length <= 0){
        requestData = ["id","old_id","name","parent_id","parent_hospital","dengji","jieshao","address","location","tel","bieming","shengfen","chengshi","is_show","pinyin","pinyin_full","sort","logo"];
    }

    var add_field = true;
    requestData.forEach(function(v){
        add_field = true;
        if(v == "parent_hospital"){
            field.push("parent_id");
            add_field = false;
            related_table.push({ parent_hospital: function(query) { query.columns(["id","name"]); }});
        }
        if(v == "shengfen"){
            related_table.push({ province: function(query) { query.columns(["region_id","region_name"]); }});
        }
        if(v == "chengshi"){
            related_table.push({ city: function(query) { query.columns(["region_id","region_name"]); }});
        }
        if(add_field){
            field.push(v);
        }
    });

    //组织查询条件
    var where_arr = {};
    if(arrData.parent_id !== undefined && arrData.parent_id !== ''){
        where_arr.parent_id=arrData.parent_id;
    }
    if(arrData.shengfen > 0){
        where_arr.shengfen=arrData.shengfen;
    }
    if(arrData.chengshi > 0){
        where_arr.chengshi=arrData.chengshi;
    }
    if(arrData.is_show > 0){
        where_arr.is_show=arrData.is_show;
    }

    var hospital_model = new db.Hospital();
    hospital_model.query(function(qb){
        qb.where(where_arr);
        if(arrData.name){
            qb.where("name","LIKE","%"+arrData.name+"%");
        }
        if(arrData.dengji){
            qb.where("dengji","LIKE","%"+arrData.dengji+"%");
        }
    }).count('id').then(function(count){
        if(count){
            var pageTotal = Math.ceil(count/pageCount);
            hospital_model.query(function(qb){
                qb.where(where_arr);
                if(arrData.name){
                    qb.where("name","LIKE","%"+arrData.name+"%");
                }
                if(arrData.dengji){
                    qb.where("dengji","LIKE","%"+arrData.dengji+"%");
                }
                qb.orderBy("id","DESC").offset(startnum).limit(pageCount);
            })
            .fetchAll({withRelated: related_table,columns:field}).then(function(host) {
                //host.models.forEach(function(model) {
                //    console.log(model.related('doctor').toJSON());
                //});
                var data = host.toJSON();
                if(data.length){
                    var show_data = data.map(function(v){
                        if(v.parent_hospital !== undefined){
                            if(v.parent_hospital.name !== undefined){
                                v.parent_hospital = v.parent_hospital.name;
                            }else{
                                v.parent_hospital = "";
                            }
                        }
                        if(v.province !== undefined){
                            if(v.province.region_name !== undefined){
                                v.shengfen = v.province.region_name;
                            }
                            delete v.province;
                        }
                        if(v.city !== undefined){
                            if(v.city.region_name !== undefined){
                                v.chengshi = v.city.region_name;
                            }
                            delete v.city;
                        }
                        return v;
                    });
                    //console.log(show_data);
                    res = {"code":40000,"msg":"成功","count":count,"pageTotal":pageTotal,"data":show_data};
                    fun(JSON.stringify(res));
                }else{
                    res = {"code":40001,"msg":"没有数据","data":data};
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
 * 根据医生id获取医院信息接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getDoctorHospitalInfo(arrData,fun){
    //验证接口是否授权，密钥等信息
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret,doctor_id = arrData.doctor_id,requestData=arrData.requestData;
    delete arrData.secret;



    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    doctor_id = parseInt(doctor_id || 0);

    if(doctor_id <= 0){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }

    requestData = typeof requestData !== "undefined" ? requestData : [];
    var field = [],related_table=[];
    if(requestData.length <= 0){
        requestData = ["id","old_id","name","parent_id","parent_hospital","dengji","jieshao","address","location","tel","bieming","shengfen","shengfen_name","chengshi","chengshi_name","is_show","pinyin","pinyin_full","sort","logo"];
    }

    new db.Doctor()
        .query(function(qb){
            qb.where("id",doctor_id);
        })
        .fetch({columns:['hospital_id']}).then(function(d) {

            var data = d.toJSON();
            console.log(data);
            var hospital_id = typeof data.hospital_id !== 'undefined' && data.hospital_id > 0 ? data.hospital_id : 0;
            if(hospital_id){
                var arrData2 = {};
                arrData2.secret = secret;
                arrData2.hospital_id = hospital_id;
                arrData2.requestData = requestData;
                arrData2 = JSON.stringify(arrData2);
                getHospitalInfo(arrData2,function(data){

                    //var data = JSON.parse(data);
                    console.log(data);//console.log("-------------");
                    fun(data);
                });
            }else{
                res = {"code":40001,"msg":"没有数据","data":data};
                fun(JSON.stringify(res));
            }
        });
}
/**
 * 根据医院id获取医院基本信息接口1-使用bookshelf方法查询  6-7ms
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getHospitalInfoTest(arrData,fun){console.log(new Date().getTime());

    //验证接口是否授权，密钥等信息
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret,hospital_id = arrData.hospital_id,requestData=arrData.requestData;
    delete arrData.secret;


    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    hospital_id = parseInt(hospital_id || 0);
    if(hospital_id <= 0){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }

    requestData = requestData || [];
    var field = [],related_table=[];
    if(requestData.length <= 0){
        requestData = ["id","old_id","name","parent_id","parent_hospital","dengji","jieshao","address","location","tel","bieming","shengfen","chengshi","is_show","pinyin","pinyin_full","sort","logo"];
    }

    var add_field = true;
    requestData.forEach(function(v){
        add_field = true;
        if(v == "parent_hospital"){
            field.push("parent_id");
            add_field = false;
            related_table.push({ parent_hospital: function(query) { query.columns(["id","name"]); }});
        }
        if(v == "shengfen"){
            related_table.push({ province: function(query) { query.columns(["region_id","region_name"]); }});
        }
        if(v == "chengshi"){
            related_table.push({ city: function(query) { query.columns(["region_id","region_name"]); }});
        }
        if(add_field){
            field.push(v);
        }
    });

    new db.Hospital()
        .query(function(qb){
            qb.where("id",hospital_id);
        })
        .fetch({withRelated: related_table,columns:field}).then(function(host) {
            var host_data = host.toJSON();
            //console.log(host_data);
            if(host_data  !== undefined){
                if(host_data.parent_hospital !== undefined){
                    if(host_data.parent_hospital.name !== undefined){
                        host_data.parent_hospital = host_data.parent_hospital.name;
                    }else{
                        host_data.parent_hospital = "";
                    }
                }
                if(host_data.province !== undefined){
                    if(host_data.province.region_name !== undefined){
                        host_data.shengfen = host_data.province.region_name;
                    }
                    delete host_data.province;
                }
                if(host_data.city !== undefined){
                    if(host_data.city.region_name !== undefined){
                        host_data.chengshi = host_data.city.region_name;
                    }
                    delete host_data.city;
                }
                res = {"code":40000,"msg":"成功","data":host_data};
            }else{
                res = {"code":40001,"msg":"没有数据","data":host_data};
            }
            fun(JSON.stringify(res));
        });
    console.log(new Date().getTime());
}

/**
 * 根据医院id获取医院基本信息接口-使用原生sql查询  4ms
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getHospitalInfo(arrData,fun){console.log(new Date().getTime());

    //验证接口是否授权，密钥等信息
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret,hospital_id = arrData.hospital_id,requestData=arrData.requestData;
    delete arrData.secret;


    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    hospital_id = parseInt(hospital_id || 0);
    if(hospital_id <= 0){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }

    requestData = requestData || [];
    var field = [],join="";
    if(requestData.length <= 0){
        requestData = ["id","old_id","name","parent_id","parent_hospital","dengji","jieshao","address","location","tel","bieming","shengfen","shengfen_name","chengshi","chengshi_name","is_show","pinyin","pinyin_full","sort","logo"];
    }

    var add_field = true;
    requestData.forEach(function(v){
        add_field = true;
        if(v == "parent_hospital"){
            field.push("h.parent_id");
            field.push("ph.name parent_hospital");
            add_field = false;
            join += " left join hospital ph on ph.id=h.parent_id ";
        }
        if(v == "shengfen_name"){
            add_field = false;
            field.push("sf.region_name shengfen_name");
            join += " left join yxw_region sf on sf.region_id=h.shengfen ";
        }
        if(v == "chengshi_name"){
            add_field = false;
            field.push("cs.region_name chengshi_name");
            join += " left join yxw_region cs on cs.region_id=h.chengshi ";
        }
        if(add_field){
            field.push("h."+v);
        }
    });

    field = field.join(",");console.log(field);
    //field = "h.id,h.name,h.parent_id,ph.name parent_hospital";
    var where = "h.id="+hospital_id;

    db.query('select '+field+' from hospital h '+join+' where '+where+' limit ?', [1]).then(function(resp) {
        var rows= resp[0];
        rows.forEach(function(host_data){
            console.log(host_data);
            if(host_data  !== undefined){
                res = {"code":40000,"msg":"成功","data":host_data};
            }else{
                res = {"code":40001,"msg":"没有数据","data":host_data};
            }
            fun(JSON.stringify(res));
        });
    });console.log(new Date().getTime());


}
/**
 * 添加医院接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function addHospital(arrData,fun){

    //验证接口是否授权，密钥等信息
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret;
    delete arrData.secret;


    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    arrData.name = (arrData.name || "").trim();
    if(arrData.name == ""){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    arrData.shengfen = parseInt(arrData.shengfen || 0);
    if(arrData.shengfen == 0){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    arrData.chengshi = parseInt(arrData.chengshi || 0);
    if(arrData.chengshi == 0){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }

    new db.Hospital().query(function(qb) {
        qb.where("name", arrData.name);
    }).fetchAll({columns:['id']}).then(function(edata){
        edata = edata.toJSON();
        if(edata.length > 0){
            res = {"code":40003,"msg":"医院已存在"};
            fun(JSON.stringify(res));
            return false;
        }else{
            new db.Hospital(arrData).save().then(function(model) {
                var data = model.toJSON();
                console.log(data);
                if(data.id){
                    res = {"code":40000,"msg":"成功","hospital_id":data.id};
                }else{
                    res = {"code":40010,"msg":"失败"};
                }
                fun(JSON.stringify(res));
            });
        }
    });
}
/**
 * 根据医院id修改医院信息接口
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function editHospital(arrData,fun){

    //验证接口是否授权，密钥等信息
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret;
    delete arrData.secret;


    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    var hospital_id = parseInt(arrData.hospital_id || 0);
    delete arrData.hospital_id;
    if(hospital_id == 0){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    arrData.name = (arrData.name || "").trim();
    if(arrData.name == ""){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }

    new db.Hospital().query(function(qb) {
        qb.where("name", arrData.name);
        qb.where("id","<>",hospital_id);
    }).fetchAll({columns:['id']}).then(function(edata){
        edata = edata.toJSON();
        if(edata.length > 0){
            res = {"code":40003,"msg":"医院已存在"};
            fun(JSON.stringify(res));
            return false;
        }else{
            new db.Hospital({id:hospital_id}).save(arrData, {patch: true}).then(function(model) {
                var data = model.toJSON();
                console.log(data);
                if(data.id){
                    res = {"code":40000,"msg":"成功","hospital_id":data.id};
                }else{
                    res = {"code":40010,"msg":"失败"};
                }
                fun(JSON.stringify(res));
            });
        }
    });
}
/**
 * 删除医院
 *
 * @service
 * @author YIYI
 * @param {string} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
//function delHospital(arrData,fun){
//
//    //验证接口是否授权，密钥等信息
//    var res = {};
//    arrData = JSON.parse(arrData);
//    arrData = arrData || {};
//    if(public_fun.isEmptyObject(arrData)){
//        res = {"code":40004,"msg":"参数错误"};
//        fun(JSON.stringify(res));
//    }
//    var secret = arrData.secret,hospital_id = arrData.hospital_id;
//    delete arrData.secret;
//
//
//    res = public_fun.check_s(secret);
//    if(res.code != 40000){
//        fun(JSON.stringify(res));
//        return false;
//    }
//
//    hospital_id = parseInt(hospital_id || 0);
//    if(hospital_id == 0){
//        res = {"code":40004,"msg":"参数错误"};
//        fun(JSON.stringify(res));
//        return false;
//    }
//
//    new db.Hospital({id: hospital_id})
//        .destroy()
//        .then(function(model) {
//            var data = model.toJSON();
//            console.log(model);console.log("--------");
//            console.log(data);
//            if(public_fun.isEmptyObject(data)){
//                res = {"code":40000,"msg":"成功","hospital_id":data.id};
//            }else{
//                res = {"code":40010,"msg":"失败"};
//            }
//            fun(JSON.stringify(res));
//        });
//}
