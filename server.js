var http = require("http"),
	url  = require("url"),
	path = require("path"),
	fs   = require("fs");
	querystring = require("querystring");  
	p = require('child_process');

var debug = true;
function debuginf(string) {
	if (debug == true) {
		console.log(string);
	}
}
var simulation = true;
var program = null;
http.createServer(function (req, res) {
	var pathname=__dirname+url.parse(req.url).pathname;
	var code;
	debuginf(pathname);
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
		  console.log(code);
		  code = querystring.parse(code); 
		  code = code.undefinedtext;
	      debuginf(code);
		  fs.writeFileSync('main.c', code);
	      program = p.exec('meteroishell main.c ',
      	      function (error,stdout,stderr) {
				if (error !== null) {
				  console.log('exec error: ' + error);
				}
                console.log(stdout);
	      });
        });
	}
	if (path.basename(pathname) =="stop") {
		if (program != null) {
			program.kill('SIGTERM');
			debuginf("stop run");
		}
	}
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
