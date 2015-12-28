/**
 * This class requires the modules  and
 * 
 * no modi
 * @module title
 */
var public_fun = require("./public_fun.js");


/**
 * 获取职称列表接口
 *
 * @service
 * @author YIYI
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getTitleList(arrData,fun){
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    var secret = arrData.secret,page = arrData.page,pageCount=arrData.pageCount;
    
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

    arrData.title_name = (arrData.title_name || "").trim();
    arrData.is_show = parseInt(arrData.is_show || "");

    var where = " 1=1 ";
    if(arrData.title_name){
        where += " AND name LIKE '%"+arrData.title_name+"%'";
    }
    if(arrData.is_show){
        where += " AND is_show = '"+arrData.is_show+"'" ;
    }

    db.query('select count(1) num from hospital_title where '+where).then(function(resp){
        var count_data= resp[0][0];
        var count = count_data.num;
        if(count) {
            var pageTotal = Math.ceil(count / pageCount);
            db.query('select * from hospital_title where '+where+' order by id desc limit '+ startnum + "," +pageCount).then(function(data) {
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
 * 获取职称信息接口
 *
 * @service
 * @author YIYI
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getTitleInfo(arrData,fun){
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    var secret = arrData.secret,title_id = arrData.title_id;

    //验证接口是否授权，密钥等信息
    var res = {};
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }
    title_id = parseInt(title_id || 0);
    if(title_id == 0){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }

    var where = " id= "+title_id;

    db.query('select id title_id,name title_name,sort title_sort,is_show from hospital_title where '+where).then(function(data) {
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
 * 添加职称接口
 *
 * @service
 * @author YIYI
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function addTitle(arrData,fun){
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
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

    arrData.name = (arrData.name || "").trim();
    if(arrData.name == ""){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    arrData.addtime = public_fun.getTimeStamp();//添加时间
    arrData.edittime = public_fun.getTimeStamp();//修改时间

    new db.HospitalTitle().query(function(qb) {
        qb.where("name", arrData.name);
    }).fetchAll({columns:['id']}).then(function(data){
        data = data.toJSON();
        if(data.length > 0){
            res = {"code":40003,"msg":"职称已存在"};
            fun(JSON.stringify(res));
            return false;
        }else{
            new db.HospitalTitle(arrData).save().then(function(model) {
                var hd_data = model.toJSON();
                console.log(hd_data);
                if(hd_data.id){
                    res = {"code":40000,"msg":"成功","title_id":hd_data.id};
                }else{
                    res = {"code":40010,"msg":"失败"};
                }
                fun(JSON.stringify(res));
            });
        }
    });
}

/**
 * 修改职称信息接口
 *
 * @service
 * @author YIYI
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function editTitle(arrData,fun){
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
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

    var title_id = parseInt(arrData.title_id || 0);
    delete arrData.title_id;
    if(title_id == 0){
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
    arrData.edittime = public_fun.getTimeStamp();//修改时间

    new db.HospitalTitle().query(function(qb){
        qb.where("name", arrData.name);
        qb.where("id","<>",title_id);
    }).fetchAll({columns:['id']}).then(function(data){
        data = data.toJSON();
        if(data.length > 0){
            res = {"code":40003,"msg":"职称已存在"};
            fun(JSON.stringify(res));
            return false;
        }else{
            new db.HospitalTitle({id:title_id}).save(arrData, {patch: true}).then(function(model) {
                var ht_data = model.toJSON();
                console.log(ht_data);
                if(ht_data.id){
                    res = {"code":40000,"msg":"成功","title_id":ht_data.id};
                }else{
                    res = {"code":40010,"msg":"失败"};
                }
                fun(JSON.stringify(res));
            });
        }
    });
}
