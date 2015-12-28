/**
 * New node file
 */
var db = require('node-db')().connect();

/**
 * Represents a book.
 * 
 * @service trans
 * @author TFC<maxkerrer@126.com> 
 * @param {string} s - The title of the book.
 */
function transform(s) {
       return s.replace(/[aeiou]{2,}/, 'oo').toUpperCase();
}

/**
 * Represents a book.
 * 
 * @service
 * @author TFC<maxkerrer@126.com> 
 */
function transformEmpty() {
       return "hello world".replace(/[aeiou]{2,}/, 'oo').toUpperCase();
}

/**
 * 获取医生列表资源
 * 
 * @service
 * @author TFC<maxkerrer@126.com> 
 * @param {int} limit - 查询数量.
 * @param {callback} fun - 回调方法
 */
function getHostList(limit,fun){
	    console.log(limit);
	    var num =  typeof limit !=="undefined" ? parseInt(limit) : 5;
    	new db.Hospital()
    	.query(function(qb){
    		qb.orderBy("id","DESC").limit(num);
    	})
    	.fetchAll().then(function(host) {
			console.log(host.toJSON());
    		fun(host.toJSON());    		 
    	}).catch(function(err) {
    		  console.error(err);
    	});
}

/**
 * 根据医生id来获取医生的信息.
 * 
 * @service
 * @author TFC<maxkerrer@126.com> 
 * @param {int} id - 医生id.
 * @param {string} fg - The author of the book.
 * @param {callback} fun - 回调方法
 */
function getHostInfo(id,fg,fun){
	     if( typeof id ==="undefined" ){
	    	 console.error("not id");
	    	 
	    	 return null;
	     }
	    id=  parseInt(id);
    	new db.Hospital()
    	.where({id: id})
    	.fetch().then(function(data) {
    		fun(data.toJSON());    		 
    	}).catch(function(err) {
    		  console.error(err);
    	});
}

