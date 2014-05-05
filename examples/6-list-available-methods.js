/*
  Example 6 - How to get the currently activated payment methods.
*/


var Mollie, example, _;

Mollie = require("../lib/mollie");

_ = require("underscore");

example = (function() {
	function example(request, response) {
	
		/*
        		Initialize the Mollie API library with your API key.
        		See: https://www.mollie.nl/beheer/account/profielen/
      		*/

		var mollie;
		mollie = new Mollie.API.Client;
		mollie.setApiKey("test_b93kfaAsnngIAT3NysojhYvKEJ5YbP");
	
		/*
			Get the all payments for this API key ordered by newest.
			*/

		mollie.methods.all(function(methods) {
			var method, _i, _len;
			if (methods.error) {
				console.error(methods.error);
				return response.end();
			}
			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});
			for (_i = 0, _len = methods.length; _i < _len; _i++) {
				method = methods[_i];
				response.write("<div style='line-height:40px; vertical-align:top'>");
				response.write("<img src='" + (_.escape(method.image.normal)) + "'>");
				response.write("" + (_.escape(method.description)) + " (" + (_.escape(method.id)) + ")</div>");
			}
			return response.end();
		});
	}

	return example;

})();

module.exports = example;