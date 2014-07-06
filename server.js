var http = require("http"),
	url  = require("url"),
	path = require("path"),
	fs   = require("fs");
	querystring = require("querystring");  
	p = require('child_process');

var debug = false;
function debuginf(string) {
	if (debug == true) {
		console.log(string);
	}
}
var simulation = true;
http.createServer(function (req, res) {
	var pathname=__dirname+url.parse(req.url).pathname;
	var code = '';
	debuginf(pathname);
	//response of run command
	if (path.basename(pathname) =="run") {
		console.log("run the code");
		pathname = path.dirname(pathname);

	      req.setEncoding("utf8");
	      req.addListener("data",function(postDataChunk){
	      code += postDataChunk;
              });
	      req.setEncoding("utf8");
	      req.addListener("end",function(postDataChunk){
	      code += postDataChunk;
	      debuginf(code);
		  code = querystring.parse(code); 
		  debuginf(code);
		  code = code.text;
	      debuginf(code);
		  fs.writeFileSync('main.c', code);
	      p.exec('meteroishell main.c ',
      	      function (error,stdout,stderr) {
	      		if (error !== null) {
	      		  console.log('program stop:');
	      			}
                console.log(stdout);
	      });

        });
	}
	//response of stop command
	if (path.basename(pathname) =="stop") {
	      p.exec('ps -ef |grep meteroi |grep -v grep|awk \'{print $2}\' | xargs kill -9',
      	      function (error,stdout,stderr) {
	      });
	}
	//response of reboot command
	if (path.basename(pathname) =="reboot") {
	      p.exec('reboot',
      	      function (error,stdout,stderr) {
	      });
	}
	//response of error message
	if (path.basename(pathname) =="error") {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end("error message");
	}
	
	//response of console message
	if (path.basename(pathname) =="console") {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end("console message");
	}
	
	// response of web request
	if (path.extname(pathname)=="") {
		pathname+="/";
	}
	if (pathname.charAt(pathname.length-1)=="/"){
		pathname+="index.html";
	}

	fs.exists(pathname,function(exists){
		if(exists){
			switch(path.extname(pathname)){
				case ".html":
					res.writeHead(200, {"Content-Type": "text/html"});
					break;
				case ".js":
					res.writeHead(200, {"Content-Type": "text/javascript"});
					break;
				case ".css":
					res.writeHead(200, {"Content-Type": "text/css"});
					break;
				case ".gif":
					res.writeHead(200, {"Content-Type": "image/gif"});
					break;
				case ".jpg":
					res.writeHead(200, {"Content-Type": "image/jpeg"});
					break;
				case ".png":
					res.writeHead(200, {"Content-Type": "image/png"});
					break;
				default:
					res.writeHead(200, {"Content-Type": "application/octet-stream"});
			}
			fs.readFile(pathname,function (err,data){
				res.end(data);
			});
		} else {
			res.writeHead(404, {"Content-Type": "text/html"});
			res.end("<h1>404 Not Found</h1>");
		}
	});

}).listen(8888);

console.log("IDE running at port 8888");
