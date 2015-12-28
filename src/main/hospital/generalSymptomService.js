/**
 * New node file
 * 医享网通用症状接口
 */
var db = require('node-db')().connect();
var public_fun = require("./public_fun.js");

/**
 * 获取症状列表接口
 *
 * @service
 * @author zhuowx
 * @param {string} arrData -参数
 * @param {callback} fun - 回调方法
 */
function getSymptomList(arrData,fun){
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

    requestData = requestData || [];

    var where = " 1 = 1";
    if(arrData.symptom_name){
        where += " AND symptom_name LIKE '%"+arrData.symptom_name+"%'";
    }

    if(arrData.write_user){
        where += " AND write_user = '"+arrData.write_user+"'" ;
    }
    
   
    if(typeof(arrData.review)!=='undefined'){
          if((arrData.review) !==''){
               where += " AND review = '"+arrData.review+"'" ;
          }
        
    }
    if(typeof(arrData.states)!=='undefined'){
         if((arrData.states) !==''){
            where += " AND states = '"+arrData.states+"'" ;
         }
    }

    var field = [];
    if(requestData.length <= 0){
        requestData = ["id","symptom_name","symptom_alif","possible_disease","possible_disease_info","symptom_drugs","inspection","similar_symptom","write_user","status","review"];
    }

    var add_field = true;
    requestData.forEach(function(v){
       
        if(add_field){
            field.push(v);
        }
    });

    field = field.join(",");

    db.query('SELECT COUNT(1) num FROM yxw_general_symptom WHERE '+where).then(function(resp){
        var count_data= resp[0][0];
        var count = count_data.num;
        if(count) {
            var pageTotal = Math.ceil(count / pageCount);
            db.query('SELECT '+field+' FROM yxw_general_symptom WHERE '+where+' ORDER BY id DESC limit '+ startnum + "," +pageCount).then(function(data) {
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

    
}


 /**
 * 根据id获取症状消息接口
 *
 * @service
 * @author zhuowx
 * @param {string} arrData -参数
 * @param {callback} fun - 回调方法
 */
function getSymptomById(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};

    //验证接口是否授权，密钥等信息
     res = public_fun.check_s(arrData.secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }
   delete arrData.secret;
 
 
    var gs_id = parseInt(arrData.id || 0);
   
    if(gs_id == 0 || gs_id.length<=0){
        res = {"code":40004,"msg":"参数错误"};
        fun(res);
        return false;
    }
     
   var requestData = arrData.requestData || [];
   var field = [];
    if(requestData.length <= 0){
        requestData = ["id","symptom_name","symptom_alif","possible_disease","overview","cause","possible_disease_info","diagnosis_info","symptom_drugs","inspection","similar_symptom","write_user","status","review"];
    }

    var add_field = true;
    requestData.forEach(function(v){
       
        if(add_field){
            field.push(v);
        }
    });

    field = field.join(",");

     db.query('select '+field+' from yxw_general_symptom where id='+gs_id).then(function(data) {
        var datas= data[0]; 
        if(datas.length > 0){
            res = {"code":40000,"msg":"成功","data":datas[0]};
            fun(JSON.stringify(res));
        }else{
            res = {"code":40001,"msg":"没有数据"};
            fun(JSON.stringify(res));
        }
    });


 
}



 /**
 * 添加症状接口
 *
 * @service
 * @author zhuowx
 * @param {string} arrData -参数
 * @param {callback} fun - 回调方法
 */
function addSymptom(arrData,fun){
	var res = {};
	arrData = JSON.parse(arrData);
	arrData = arrData || {};

    //验证接口是否授权，密钥等信息
     res = public_fun.check_s(arrData.secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }
   delete arrData.secret;
 
    if(arrData.symptom_name==''){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
  
    arrData.addtime = public_fun.getTimeStamp();//添加时间

    new db.General_Symptom().query(function(qb){
        qb.where("symptom_name",arrData.symptom_name);
    }).fetchAll({columns:['id']}).then(function(data){
        data = data.toJSON();
        if(data.length > 0){
            res = {"code":40003,"msg":"症状名已存在"};
            fun(JSON.stringify(res));
            return false;
        }else{
            new db.General_Symptom(arrData).save().then(function(model) {
                var gs_data = model.toJSON();
                console.log(gs_data);
                if(gs_data.id){
                    res = {"code":40000,"msg":"成功","renzheng_id":gs_data.id};
                }else{
                    res = {"code":40010,"msg":"失败"};
                }
               fun(JSON.stringify(res));
            });
        }
    });
}



/**
 * 根据症状id修改症状信息接口
 *
 * @service
 * @author zhuowx
 * @param {string} arrData -参数
 * @param {callback} fun - 回调方法
 */
function editSymptom(arrData,fun){
    var res = {};
	arrData = JSON.parse(arrData);
	arrData = arrData || {};

    //验证接口是否授权，密钥等信息
     res = public_fun.check_s(arrData.secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }
   delete arrData.secret;
    var gs_id = parseInt(arrData.id || 0);
   
    if(gs_id == 0 || gs_id.length<=0){
        res = {"code":40004,"msg":"参数错误"};
        fun(res);
        return false;
    }
     delete arrData.id;


    new db.General_Symptom().query(function(qb){
        qb.where("symptom_name",arrData.symptom_name);
        qb.where("id","<>",gs_id);

    }).fetchAll({columns:['id']}).then(function(data){
        data = data.toJSON();
        if(data.length > 0){
            res = {"code":40003,"msg":"症状名已存在"};
            fun(JSON.stringify(res));
            return false;
        }else{

            new db.General_Symptom({id:gs_id}).save(arrData, {patch: true}).then(function(model) {
                var data = model.toJSON();
                console.log(data);
                if(data.id){
                    res = {"code":40000,"msg":"修改成功","id":data.id};
                }else{
                    res = {"code":40010,"msg":"失败"};
                }
                fun(JSON.stringify(res));
            });
        }
    });


}



/**
 * 删除症状接口
 *
 * @service
 * @author zhuowx
 * @param {string} arrData -参数
 * @param {callback} fun - 回调方法
 */
function delSymptom(arrData,fun){
    var res = {};
	arrData = JSON.parse(arrData);
	arrData = arrData || {};

    //验证接口是否授权，密钥等信息
     res = public_fun.check_s(arrData.secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    var gs_id = parseInt(arrData.id || 0);
   
    if(gs_id == 0 || gs_id.length<=0){
        res = {"code":40004,"msg":"参数错误"};
         fun(JSON.stringify(res));
        return false;
    }

    new db.General_Symptom().query(function(qb){
        qb.where("id",gs_id);
    }).destroy().then(function(model) {
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
 * 随机获取一个未审核的症状
 *
 * @service
 * @author echo
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getSymptomRandId(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret;
    delete arrData.secret;
    //var disease_id = arrData.id;

    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }
	 new db.query("select id from yxw_general_symptom where status=0  order by rand() LIMIT 1").then(function(data){
		var datas= data[0];
		console.log(datas);
        if(datas.length > 0){
            res = {"code":40000,"msg":"成功","data":datas[0]};
            fun(JSON.stringify(res));
        }else{
            res = {"code":40001,"msg":"没有数据"};
            fun(JSON.stringify(res));
        }
	})
	console.log(new Date().getTime());
}
