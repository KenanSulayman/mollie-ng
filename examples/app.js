var app;

var http = require("http"),
     url = require("url"),
      fs = require("fs");

/*
	Example app.
*/

app = http.createServer(function(request, response) {
	var error, example, path;
	path = url.parse(request.url).pathname;
	
	/*
		Load requested example.
	*/

	try {
		example = require("." + path);
		return new example(request, response);
	} catch (_error) {
		error = _error;
		console.error(error);
		response.writeHead(200, {
			"Content-Type": "text/html; charset=utf-8"
		});
		response.write('<a href="./1-new-payment">Try example 1</a><br>');
		response.write('<a href="./4-ideal-payment">Try example 4</a>');
		return response.end();
	}
});

app.listen(8888);