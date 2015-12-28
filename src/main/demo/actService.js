/**
 * This class requires the modules  and
 * @module service_act  
 */

/**
 * Represents a book.
 * 
 * @service trans
 * @author TFC<maxkerrer@126.com> 
 * @param {string} s - The title of the book.
 * @returns {string}  the uppper string.
 */
function transform(s) {
       return s.replace(/[aeiou]{2,}/, 'oo').toUpperCase();
}

/**
 * Represents a book.
 * 
 * @service  maxkerrer
 * @author TFC<maxkerrer@126.com> 
 * @returns {string}  the uppper string.
 */
function transformEmpty() {
       return "hello world".replace(/[aeiou]{2,}/, 'oo').toUpperCase();
}

/**
 * 获取医生列表资源
 * 
 * @service getHostList
 * @author TFC<maxkerrer@126.com> 
 * @param {int} limit - 查询数量.
 * @param {callback} cb - 回调方法
 * @returns {string}  the uppper string.
 */
function getHostList(limit,cb){ 
	    var num =  typeof limit !=="undefined" ? parseInt(limit) : 5;
    	new db.Hospital()
    	.query(function(qb){
    		qb.orderBy("id","DESC").limit(num);
    	})
    	.fetchAll().then(function(host) {
			if(1){
				//cb(Err.QueryInvalideParams(40004,"参数错误"));
				
			}			
    		cb(null,host.toJSON());    		 
    	}).catch(function(err) {
    		throw err;
    	});
}

/**
 * 根据医生id来获取医生的信息.
 * 
 * @service
 * @author TFC<maxkerrer@126.com> 
 * @param {int} id - 医生id.
 * @param {string} fg - The author of the book.
 * @param {callback} cb - 回调方法
 */
function getHostInfo(id,fg,cb){
	     if( typeof id ==="undefined" ){
	    	 console.error("not id");
	    	 throw new Error("not id");
	     }
	    id=  parseInt(id);
    	new db.Hospital()
    	.where({id: id})
    	.fetch().then(function(data) {
    		cb(null,data.toJSON());    		 
    	}).catch(function(err) {
    		throw err;
    	});
}

