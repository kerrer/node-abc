/**
 * New node file
 * 疾病信息接口
 */
var db = require('node-db')().connect();
var public_fun = require("./public_fun.js");


/**
 * 获取疾病列表接口
 *
 * @service
 * @author zhoujf
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getDiseaseList(arrData,fun){
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
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
	var field = [],related_table=[];
    requestData = requestData || [];
    if(requestData.length <= 0){
        requestData = ["id","disease_name","alias","department_one","department_two","write_user","review","status","addtime"];
    }
	var add_field = true;
	requestData.forEach(function(value){
		add_field = true;
        if(value === "department_one"){
			field.push('bcate_id');
            related_table.push({ department1: function(query) { query.columns(["id","keshi_name"]); }});
			add_field = false;
        }
        if(value === "department_two"){
			field.push('scate_id');
            related_table.push({ department2: function(query) { query.columns(["id","keshi_name"]); }});
			add_field = false;
        }
		if(add_field){
			field.push(value);
		}
	});
	
    arrData.disease_name = (arrData.disease_name || "").trim();
	arrData.department_one = parseInt(arrData.department_one || 0);
	arrData.department_two = parseInt(arrData.department_two || 0);
	arrData.write_user = (arrData.write_user || "").trim();
	if(typeof(arrData.review)!=='undefined'){
		if(arrData.review === '') delete arrData.review;
		else arrData.review = parseInt(arrData.review);
	}
    if(typeof(arrData.status)!=='undefined'){
		if(arrData.status === '') delete arrData.status;
		else arrData.status = parseInt(arrData.status);
	}
    var where_arr = {};
    if(arrData.department_one){
		where_arr.bcate_id=arrData.department_one;
    }
    if(arrData.department_two){
		where_arr.scate_id=arrData.department_two;
    }
    if(arrData.write_user){
		where_arr.write_user=arrData.write_user;
    }
	if(typeof(arrData.review)==='number'){
		where_arr.review=arrData.review;
    }
	if(typeof(arrData.status)==='number'){
		where_arr.status=arrData.status;
    }

    new db.YxwGeneralDisease().query(function(qb){
        qb.where(where_arr);
		if(arrData.disease_name){
			qb.where("disease_name","LIKE",arrData.disease_name+"%");
		}
    }).count('*').then(function(count){
        if(count){
            var pageTotal = Math.ceil(count/pageCount);
            new db.YxwGeneralDisease().query(function(qb){
                qb.where(where_arr);
				if(arrData.disease_name){
					qb.where("disease_name","LIKE",arrData.disease_name+"%");
				}
                qb.orderBy("id","DESC").offset(startnum).limit(pageCount);
            })
            .fetchAll({withRelated: related_table,columns:field}).then(function(list) {
                var data = list.toJSON();
                if(data.length){
                    var show_data = data.map(function(v){
                        if(v.department1 !== undefined){
                            if(v.department1.keshi_name !== undefined){
                                v.department_one = v.department1.keshi_name;
                            }
							delete v.department1;
                        }
                        if(v.department2 !== undefined){
                            if(v.department2.keshi_name !== undefined){
                                v.department_two = v.department2.keshi_name;
                            }
							delete v.department2;
                        }
                        return v;
                    });
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
    console.log(new Date().getTime());
}

/**
 * 根据id获取疾病基本信息接口
 *
 * @service
 * @author zhoujf
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getDiseaseInfo(arrData,fun){
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    var secret = arrData.secret,disease_id = arrData.id,requestData=arrData.requestData;

    //验证接口是否授权，密钥等信息
    var res = {};
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }
    disease_id = parseInt(disease_id || 0);
    if(disease_id === 0){
        res = {"code":40004,"msg":"缺少参数"};
        fun(JSON.stringify(res));
        return false;
    }
	var field = [],related_table=[];
    requestData = requestData || [];
    if(requestData.length <= 0){
        requestData = ["id","disease_name","alias","department_one","department_two","disease_alif","write_user","review","status","addtime"];
    }
	var add_field = true;
	requestData.forEach(function(value){
		add_field = true;
        if(value === "department_one"){
			field.push('bcate_id');
            related_table.push({ department1: function(query) { query.columns(["id","keshi_name"]); }});
			add_field = false;
        }
        if(value === "department_two"){
			field.push('scate_id');
            related_table.push({ department2: function(query) { query.columns(["id","keshi_name"]); }});
			add_field = false;
        }
		if(add_field){
			field.push(value);
		}
	});
	
    var where_arr = {};
	where_arr.id = disease_id;
	new db.YxwGeneralDisease().query(function(qb){
		qb.where(where_arr);
	})
	.fetch({withRelated: related_table,columns:field}).then(function(info) {
		var data = info.toJSON();
		if(data){
			if(data.department1 !== undefined){
				if(data.department1.keshi_name !== undefined){
					data.department_one = data.department1.keshi_name;
				}
				delete data.department1;
			}
			if(data.department2 !== undefined){
				if(data.department2.keshi_name !== undefined){
					data.department_two = data.department2.keshi_name;
				}
				delete data.department2;
			}
			
			res = {"code":40000,"msg":"成功","data":data};
			fun(JSON.stringify(res));
		}else{
			res = {"code":40001,"msg":"没有数据","data":data};
			fun(JSON.stringify(res));
		}
	});
    console.log(new Date().getTime());
}

/**
 * 添加疾病接口
 *
 * @service
 * @author zhoujf
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function addDisease(arrData,fun){
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

    arrData.disease_name = (arrData.disease_name || "").trim();
    if(arrData.disease_name == ""){
        res = {"code":40004,"msg":"缺少参数"};
        fun(JSON.stringify(res));
        return false;
    }
    arrData.addtime = public_fun.getTimeStamp();//添加时间

    new db.YxwGeneralDisease().query(function(qb) {
        qb.where("disease_name", arrData.disease_name);
    }).fetchAll({columns:['id']}).then(function(data){
        data = data.toJSON();
        if(data.length > 0){
            res = {"code":40003,"msg":"疾病已存在"};
            fun(JSON.stringify(res));
            return false;
        }else{
            new db.YxwGeneralDisease(arrData).save().then(function(model) {
                var info = model.toJSON();
                if(info.id){
                    res = {"code":40000,"msg":"成功","id":info.id};
                }else{
                    res = {"code":40010,"msg":"失败"};
                }
                fun(JSON.stringify(res));
            });
        }
    });
}

/**
 * 根据id修改疾病基本信息接口
 *
 * @service
 * @author zhoujf
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function editDisease(arrData,fun){
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

    var disease_id = parseInt(arrData.id || 0);
    delete arrData.id;
    if(disease_id == 0){
        res = {"code":40004,"msg":"缺少参数"};
        fun(JSON.stringify(res));
        return false;
    }
    arrData.disease_name = (arrData.disease_name || "").trim();
    if(arrData.disease_name == ""){
        res = {"code":40004,"msg":"缺少参数"};
        fun(JSON.stringify(res));
        return false;
    }

    new db.YxwGeneralDisease().query(function(qb){
        qb.where("disease_name", arrData.disease_name);
        qb.where("id","<>",disease_id);
    }).fetchAll({columns:['id']}).then(function(data){
        data = data.toJSON();
        if(data.length > 0){
            res = {"code":40003,"msg":"疾病已存在"};
            fun(JSON.stringify(res));
            return false;
        }else{
            new db.YxwGeneralDisease({id:disease_id}).save(arrData, {patch: true}).then(function(model) {
                var info = model.toJSON();
                if(info.id){
                    res = {"code":40000,"msg":"成功","id":info.id};
                }else{
                    res = {"code":40010,"msg":"失败"};
                }
                fun(JSON.stringify(res));
            });
        }
    });
}

/**
 * 获取疾病详细信息接口
 *
 * @service
 * @author zhoujf
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getDiseaseExtra(arrData,fun){
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    var secret = arrData.secret,disease_id = arrData.disease_id,class1 = arrData.class1,class2 = arrData.class2;

    //验证接口是否授权，密钥等信息
    var res = {};
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }
	
    disease_id = parseInt(disease_id || 0);
	class1 = parseInt(class1 || 0);
	class2 = parseInt(class2 || 0);
    if(disease_id === 0 || class1 === 0){
        res = {"code":40004,"msg":"缺少参数"};
        fun(JSON.stringify(res));
        return false;
    }
	
	var field = ['id','disease_id','class_name','class2','class1','sort'];
    var where_arr = {};
	where_arr.disease_id = disease_id;
	where_arr.class1 = class1;
	if(class2){
		where_arr.class2 = class2;
	}
	new db.YxwGeneralDiseaseExtra().query(function(qb){
		qb.where(where_arr);
		qb.orderBy("sort","DESC");
		qb.orderBy("id","ASC");
	})
	.fetchAll({columns:field}).then(function(info) {
		var data = info.toJSON();
		//默认某个一级栏目的二级栏目
		var default_classes = new Array();
		default_classes[1] = [
			{"class_name": "简介", "is_default": "1","class2":"1", "sort":"0"},
			{"class_name":"病因", "is_default":"1", "class2":"2", "sort":"1"},
			{"class_name":"病理", "is_default":"1", "class2":"3", "sort":"2"},
			{"class_name":"发病率", "is_default":"1", "class2":"4", "sort":"3"},
			{"class_name":"流行病学", "is_default":"1", "class2":"5", "sort":"4"},
			{"class_name":"遗传模式", "is_default":"1", "class2":"6", "sort":"5"},
			{"class_name":"症状", "is_default":"1", "class2":"7", "sort":"6"},
			{"class_name":"医学检查", "is_default":"1", "class2":"8", "sort":"7"},
			{"class_name":"诊断", "is_default":"1", "class2":"9", "sort":"8"},
			{"class_name":"疾病分期", "is_default":"1", "class2":"10", "sort":"9"},
			{"class_name":"鉴别诊断", "is_default":"1", "class2":"11", "sort":"10"},
			{"class_name":"并发症", "is_default":"1", "class2":"12", "sort":"11"},
			{"class_name":"治疗方法", "is_default":"1", "class2":"13", "sort":"12"},
			{"class_name":"治疗费用", "is_default":"1", "class2":"14", "sort":"13"},
			{"class_name":"护理", "is_default":"1", "class2":"15", "sort":"14"},
			{"class_name":"饮食保健", "is_default":"1", "class2":"16", "sort":"15"},
			{"class_name":"预后", "is_default":"1", "class2":"17", "sort":"16"},
			{"class_name":"常见检查", "is_default":"1", "class2":"18", "sort":"17"},
			{"class_name":"适宜食物", "is_default":"1", "class2":"19", "sort":"18"},
			{"class_name":"忌吃食物", "is_default":"1", "class2":"20", "sort":"19"},
			{"class_name":"常见并发症", "is_default":"1", "class2":"21", "sort":"20"},
		];
		if(data.length){
			var class2_arr = [];
			data.forEach(function(v){
				class2_arr[v.class2] = 1;
				
			});
			if(default_classes[class1] && !class2){
				default_classes[class1].forEach(function(v){
					if(!class2_arr[v.class2]){
						v.disease_id = disease_id;
						data.push(v);
					}
				});
				data.sort(public_fun.getSortField('sort'));
			}
			
			res = {"code":40000,"msg":"成功","data":data};
			fun(JSON.stringify(res));
		}else{
			if(default_classes[class1] && !class2){
				data = default_classes[class1];
				res = {"code":40000,"msg":"成功","data":data};
				fun(JSON.stringify(res));
			}else{
				res = {"code":40001,"msg":"没有数据","data":data};
				fun(JSON.stringify(res));
			}
		}
	});
    console.log(new Date().getTime());
}

/**
 * 删除疾病信息接口
 *
 * @service
 * @author zhoujf
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function delDisease(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret;
    delete arrData.secret;
    var disease_id = arrData.id;

    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }

    disease_id = (disease_id || "");
    if(disease_id === ""){
        res = {"code":40004,"msg":"缺少参数"};
        fun(JSON.stringify(res));
        return false;
    }
	
    disease_id = disease_id.split(",");
    new db.YxwGeneralDisease().query(function(qb){
        qb.where("id","IN",disease_id);
    }).destroy().then(function(model) {
			var data = model.toJSON();
			console.log(data);
			if(public_fun.isEmptyObject(data)){
				res = {"code":40000,"msg":"成功"};
				new db.YxwGeneralDiseaseExtra().query(function(qb){
					qb.where("disease_id","IN",disease_id);
				}).destroy().then(function(model2) {
					var data2 = model2.toJSON();
					if(!public_fun.isEmptyObject(data2)){
						res = {"code":40010,"msg":"失败"};
					}
				});
			}else{
				res = {"code":40010,"msg":"失败"};
			}
			fun(JSON.stringify(res));
		});
}

/**
 * 修改疾病详细信息接口
 *
 * @service
 * @author zhoujf
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function editDiseaseExtra(arrData,fun){
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

    var id = parseInt(arrData.id || 0);
    delete arrData.id;
    if(id == 0){
        res = {"code":40004,"msg":"缺少参数"};
        fun(JSON.stringify(res));
        return false;
    }
    arrData.class_name = (arrData.class_name || "").trim();
	arrData.disease_id = parseInt(arrData.disease_id || 0);
	arrData.class1 = parseInt(arrData.class1 || 0);
	arrData.class2 = parseInt(arrData.class2 || 0);
    if(arrData.class_name === "" || arrData.disease_id === 0 || arrData.class1 === 0 || arrData.class2 === 0){
        res = {"code":40004,"msg":"缺少参数"};
        fun(JSON.stringify(res));
        return false;
    }
	arrData.content = (arrData.content || "").trim();
	arrData.is_default = parseInt(arrData.is_default || 0);
	arrData.sort = parseInt(arrData.sort || 0);
	arrData.edit_time = public_fun.getTimeStamp();//修改时间

    new db.YxwGeneralDiseaseExtra().query(function(qb){
        qb.where("class_name", arrData.class_name);
		qb.where("disease_id", arrData.disease_id);
		qb.where("class1", arrData.class1);
        qb.where("id","<>",id);
    }).fetchAll({columns:['id']}).then(function(data){
        data = data.toJSON();
        if(data.length > 0){
            res = {"code":40003,"msg":"栏目已存在"};
            fun(JSON.stringify(res));
            return false;
        }else{
            new db.YxwGeneralDiseaseExtra({id:id}).save(arrData, {patch: true}).then(function(model) {
                var info = model.toJSON();
                if(info.id){
                    res = {"code":40000,"msg":"成功","id":info.id};
                }else{
                    res = {"code":40010,"msg":"失败"};
                }
                fun(JSON.stringify(res));
            });
        }
    });
}

/**
 * 添加疾病详细信息接口
 * 栏目存在则修改
 * @service
 * @author zhoujf
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function addDiseaseExtra(arrData,fun){
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

    arrData.class_name = (arrData.class_name || "").trim();
	arrData.disease_id = parseInt(arrData.disease_id || 0);
	arrData.class1 = parseInt(arrData.class1 || 0);
    if(arrData.class_name === "" || arrData.disease_id === 0 || arrData.class1 === 0){
        res = {"code":40004,"msg":"缺少参数"};
        fun(JSON.stringify(res));
        return false;
    }
	arrData.class2 = parseInt(arrData.class2 || 0);
	arrData.content = (arrData.content || "").trim();
	arrData.is_default = parseInt(arrData.is_default || 0);
	arrData.sort = parseInt(arrData.sort || 0);
	arrData.add_time = public_fun.getTimeStamp();//添加时间
	arrData.edit_time = public_fun.getTimeStamp();//修改时间

	new db.YxwGeneralDiseaseExtra().query(function(qb){
		qb.where("disease_id", arrData.disease_id);
		qb.where("class_name",arrData.class_name);
		qb.limit('1');
	}).fetchAll({columns:['id']}).then(function(check){
		var ckres = check.toJSON();
        if(ckres.length > 0){
            res = {"code":40003,"msg":"栏目已存在"};
            fun(JSON.stringify(res));
            return false;
        }else{
			if(arrData.class2){
				if(!arrData.sort){
					arrData.sort = arrData.class2;
				}
				new db.YxwGeneralDiseaseExtra().save(arrData).then(function(model) {
					var info = model.toJSON();
					if(info.id){
						res = {"code":40000,"msg":"成功","id":info.id};
					}else{
						res = {"code":40010,"msg":"失败"};
					}
					fun(JSON.stringify(res));
				});
				return false;
			}else{	
				new db.YxwGeneralDiseaseExtra().query(function(qb){
					qb.where("disease_id", arrData.disease_id);
					qb.orderBy("class2",'DESC');
					qb.limit('1');
				}).fetchAll({columns:['class2']}).then(function(dat){
					var data = dat.toJSON();
					if(data.length > 0 && data[0].class2 > 21){
						arrData.class2 = data[0].class2+1;
						if(!arrData.sort){
							arrData.sort = arrData.class2;
						}
						new db.YxwGeneralDiseaseExtra().save(arrData).then(function(model) {
							var info = model.toJSON();
							if(info.id){
								res = {"code":40000,"msg":"成功","id":info.id};
							}else{
								res = {"code":40010,"msg":"失败"};
							}
							fun(JSON.stringify(res));
						});
						return false;
					}else{
						arrData.class2 = 22;
						if(!arrData.sort){
							arrData.sort = arrData.class2;
						}
						new db.YxwGeneralDiseaseExtra().save(arrData).then(function(model) {
							var info = model.toJSON();
							if(info.id){
								res = {"code":40000,"msg":"成功","id":info.id};
							}else{
								res = {"code":40010,"msg":"失败"};
							}
							fun(JSON.stringify(res));
						});
					}
				});
			}
		}
	});
}


/**
 * 获取疾病详细信息接口
 *
 * @service
 * @author zhoujf
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getDiseaseExtraContent(arrData,fun){
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
        return false;
    }
    var secret = arrData.secret,disease_id = arrData.disease_id,class1 = arrData.class1,class2 = arrData.class2;

    //验证接口是否授权，密钥等信息
    var res = {};
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }
	
    disease_id = parseInt(disease_id || 0);
	class1 = parseInt(class1 || 0);
	class2 = parseInt(class2 || 0);
    if(disease_id === 0 || class2 === 0){
        res = {"code":40004,"msg":"缺少参数"};
        fun(JSON.stringify(res));
        return false;
    }
	
	var field = ["*"];
    var where_arr = {};
	where_arr.disease_id = disease_id;
	if(class1) where_arr.class1 = class1;
	where_arr.class2 = class2;

	new db.YxwGeneralDiseaseExtra().query(function(qb){
		qb.where(where_arr);
		qb.orderBy("sort","DESC");
		qb.orderBy("id","ASC");
	})
	.fetch({columns:field}).then(function(info) {
		var data = info.toJSON();
		
		res = {"code":40000,"msg":"成功","data":data};
		fun(JSON.stringify(res));

	})
	.catch(function (err) {
			res = {"code":40001,"msg":"没有数据","err":err};
			fun(JSON.stringify(res));
		}); 
    console.log(new Date().getTime());
}


/**
 * 随机获取一个未审核的疾病
 *
 * @service
 * @author echo
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function getDiseaseRandId(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret,status = arrData.status,extra_status = arrData.extra_status;
    delete arrData.secret;
    var where = "status=0 ";
	if(status){
		where = "status="+status;
	}else if(typeof(extra_status) !== 'undefined'){
		where = "extra_status="+extra_status;
	}
    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }
	 new db.query("select id from yxw_general_disease where "+where+" order by rand() LIMIT 1").then(function(data){
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
/**
 * 更改审核状态
 *
 * @service
 * @author zhouf
 * @param {json} arrData -传递的参数，json字符串形式
 * @param {callback} fun - 回调方法
 */
function editDiseaseStatus(arrData,fun){
    var res = {};
    arrData = JSON.parse(arrData);
    arrData = arrData || {};
    if(public_fun.isEmptyObject(arrData)){
        res = {"code":40004,"msg":"参数错误"};
        fun(JSON.stringify(res));
    }
    var secret = arrData.secret,disease_id = arrData.id,status = arrData.status,extra_status = arrData.extra_status;
    delete arrData.secret;
	delete arrData.id;
	if( (typeof(extra_status) === 'undefined' && typeof(extra_status) === 'undefined') || !disease_id){
		res = {"code":40004,"msg":"缺少必要参数"};
        fun(JSON.stringify(res));
	}
    //验证接口是否授权，密钥等信息
    res = public_fun.check_s(secret);
    if(res.code != 40000){
        fun(JSON.stringify(res));
        return false;
    }
	 new db.YxwGeneralDisease({id:disease_id}).save(arrData, {patch: true}).then(function(model){
		var info = model.toJSON();
		console.log(info);
        if(info){
            res = {"code":40000,"msg":"成功","data":info};
            fun(JSON.stringify(res));
        }else{
            res = {"code":40001,"msg":"失败"};
            fun(JSON.stringify(res));
        }
	})
	console.log(new Date().getTime());
}