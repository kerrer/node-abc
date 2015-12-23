var grunt = require('grunt');

process.on('message',function(obj){
	grunt.tasks(['default'],null,function(){
		if(obj.type==="main"){
			if(obj.data==="newbuild"){
				 process.send({'type':'grunt','data':"start"});
			}else if(obj.data==="rebuild"){
				 process.send({'type':'grunt','data':"reload"});
			}
		}else{
			 process.send({'type':'grunt','data':"no"});
		}	
	});		
});

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err.message,err.stack);
});

process.on('exit', function(code) { 
  // do *NOT* do this
  setTimeout(function() {
      console.log("服务停止中............................");
  }, 0);
  console.log('About to exit with code:', code);
});
