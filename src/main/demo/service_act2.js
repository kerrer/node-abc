/**
 * New node file
 */
var db = require('node-db')().connect();

/**
 * Represents a book333333333333333333333333333.
 *
 * @fhhh ghhhj
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

