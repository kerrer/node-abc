/**
 * New node file grunt testall:testGethostList
 */
var Service;
exports.setUp=function (callback) {
        Service= require('services')('127.0.0.1','4001').client();
        callback();
};
exports.tearDown=function (callback) {
        console.log("end");
        callback();
};
exports.testService=function(test){ 
	test.notEqual(false,Service.online,"service is not online");
	test.done();
};
exports.testGethostList=function(test){    
    Service.get("NODES.gethostlist",{'limit':1},function(error,data){ console.log(error);
		test.equal(null,error,"error hanpend");
        //test.equal(1,data.length,"number of rows ");
        test.done();
    });
    

};
exports.testSomething = function(test){
    test.expect(1);
    test.ok(true, "this assertion should pass");
    test.done();
};

exports.testSomethingElse = function(test){
    test.ok(true, "this assertion should fail");
    test.done();
};
