var example, fs, url, _;

url = require("url");

_ = require("underscore");

fs = require("fs");

example = (function() {
	function example(request, response) {
	/*
        	In this example we retrieve the order stored in the database.
        	Here, it's unnecessary to use the Mollie API Client.
      	*/

		var params, status;
		params = url.parse(request.url, true).query;
		status = this.databaseRead(params.orderId);
		response.writeHead(200, {
			'Content-Type': "text/html; charset=utf-8"
		});
		response.write("<p>Your payment status is '" + (_.escape(status)) + "'.</p>");
		response.write("<p>");
		response.write("<a href=\"http://" + request.headers.host + "/1-new-payment\">Retry example 1</a><br>");
		response.write("<a href=\"http://" + request.headers.host + "/4-ideal-payment\">Retry example 4</a><br>");
		response.write("</p>");
		response.end();
	}

	/*
		NOTE: This example uses a text file as a database. Please use a real database like MySQL in production code.
    	*/


	example.prototype.databaseRead = function(orderId) {
		orderId = parseInt(orderId);
		return fs.readFileSync(__dirname + ("/orders/order-" + orderId + ".txt"));
	};

	return example;
})();

module.exports = example;