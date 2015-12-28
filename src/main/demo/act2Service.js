/**
 * 这个模块的作用主要是模拟医院的获取列表和
 * 
 * @module demo.act2
 * @requires db
 * @requires Err
 * @requires Promise
 */

/**
 * Represents a book333333333333333333333333333.
 * 
 * @service
 * @author Jane Smith 
 * @param {string} s - The title of the book.
 */
function transform2(s) {
        return s.replace(/[aeiou]{2,}/, 'oo').toUpperCase();
}


/**
 * Represents a book44444444444444444444444444444444444444444.
 * 
 * @service gethost22
 * @deprecated  请使用替代方法:getthost
 * @author Jane Smith 
 * @param {callback} fun 回调方法
 */
function gethost2(fun){
    	new db.Hospital()
    	.query(function(qb){
    		qb.orderBy("id","DESC").limit(5);
    	})
    	.fetchAll().then(function(host) {
    		fun(host);    		 
    	}).catch(function(err) {
    		  console.error(err);
    	});
}

/**
 * Represents a book333333333333333.
 * 
 * @service gethost3333
 * @promise
 * @author Jane Smith 
 * @param {int} limit 回调方法
 */
function gethostp(limit){
	return   new Promise(function (resolve, reject){	
    	new db.Hospital()
    	.query(function(qb){
    		qb.orderBy("id","DESC").limit(limit);
    	})
    	.fetchAll().then(function(host) {
    		resolve(host);    		 
    	}).catch(function(err) {
    		reject(err);
    	});
    });
}
