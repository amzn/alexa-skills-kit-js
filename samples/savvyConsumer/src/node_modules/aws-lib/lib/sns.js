
exports.init = init;

function init(genericAWSClient) {
	return createSimpleNotificationServiceClient;

	function createSimpleNotificationServiceClient(accessKeyId, secretAccessKey, options) {
		options = options || {}; 

		var client = genericAWSClient({
			host: options.host || "sns.us-east-1.amazonaws.com",
			path: options.path || "/",
			accessKeyId: accessKeyId,
			secretAccessKey: secretAccessKey,
			secure: options.secure,
			version: options.version
		});

		return {
			client: client,
			call: call
		}

		function call(action, query, callback) {
			query["Action"] = action
			query["SignatureMethod"] = "HmacSHA256"
			query["SignatureVersion"] = "2" 
			return client.call(action, query, callback);
		}   
	}
}
