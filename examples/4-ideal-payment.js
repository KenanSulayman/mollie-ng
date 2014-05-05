/*
  Example 4 - How to prepare an iDEAL payment with the Mollie API.
*/

var Mollie, example, fs, querystring, _;

querystring = require("querystring"),
fs = require("fs");

Mollie = require("../lib/mollie"),
_ = require("underscore");

example = (function() {
	function example(request, response) {
		var _this = this;
		this.body = "";
		request.on("data", function(data) {
			return _this.body += data;
		});
		request.on("end", function() {
			var issuers, mollie, orderId;
			_this.body = querystring.parse(_this.body);
			
			/*
        			Initialize the Mollie API library with your API key.
        			See: https://www.mollie.nl/beheer/account/profielen/
        		*/

			mollie = new Mollie.API.Client;
			mollie.setApiKey("test_b93kfaAsnngIAT3NysojhYvKEJ5YbP");
			
			/*
        			First, let the customer pick the bank in a simple HTML form. This step is actually optional.
        		*/

			if (request.method !== "POST") {
				issuers = mollie.issuers.all(function(issuers) {
					var issuer, _i, _len;
					response.writeHead(200, {
						'Content-Type': "text/html; charset=utf-8"
					});
					response.write('<form method="post">Select your bank: <select name="issuer">');
					for (_i = 0, _len = issuers.length; _i < _len; _i++) {
						issuer = issuers[_i];
						if (issuer.method === Mollie.API.Object.Method.IDEAL) {
							response.write("<option value=\"" + (_.escape(issuer.id)) + "\">" + (_.escape(issuer.name)) + "</option>");
						}
					}
					response.write('<option value="">or select later</option>');
					response.write('</select><button>OK</button></form>');
					return response.end();
				});
				return;
			}

			/*
			        Generate a unique order id for this example. It is important to include this unique attribute
			        in the redirectUrl (below) so a proper return page can be shown to the customer.
		        */

			orderId = new Date().getTime();

			/*
			          Payment parameters:
			            amount        Amount in EUROs. This example creates a € 10,- payment.
			            method        Payment method "ideal".
			            description   Description of the payment.
			            redirectUrl   Redirect location. The customer will be redirected there after the payment.
			            metadata      Custom metadata that is stored with the payment.
			            issuer        The customer's bank. If empty the customer can select it later.
		        */

			return mollie.payments.create({
				amount: 25.00,
				method: Mollie.API.Object.Method.IDEAL,
				description: "My first iDEAL payment",
				redirectUrl: "http://" + request.headers.host + "/3-return-page?orderId=" + orderId,
				metadata: {
					orderId: orderId
				},
				issuer: _this.body.issuer || null
			}, function(payment) {
				if (payment.error) {
					console.error(payment.error);
					return response.end();
				}
				
				/*
        				In this example we store the order with its payment status in a database.
          			*/

				_this.databaseWrite(orderId, payment.status);
	
				/*
        				Send the customer off to complete the payment.
  				*/

				response.writeHead(302, {
					Location: payment.getPaymentUrl()
				});
				return response.end();
			});
		});
	}

	/*
      		NOTE: This example uses a text file as a database. Please use a real database like MySQL in production code.
    	*/


	example.prototype.databaseWrite = function(orderId, paymentStatus) {
		orderId = parseInt(orderId);
		return fs.writeFile(__dirname + ("/orders/order-" + orderId + ".txt"), paymentStatus);
	};

	return example;

})();

module.exports = example;