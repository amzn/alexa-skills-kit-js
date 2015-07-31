
exports.init = init;

function init(genericAWSClient) {
  return createEC2Client;

  function createEC2Client(accessKeyId, secretAccessKey, options) {
    options = options || {};

    var client = genericAWSClient({
      host: options.host || "ec2.amazonaws.com",
      path: options.path || "/",
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      secure: options.secure,
      token: options.token
    });

    return {
      client: client,
      call: call
    };
    
    function call(action, opts, callback) {
  	  var query = {
        "Action": action,
        "Version": options.version || "2012-12-01",
        "SignatureMethod": "HmacSHA256",
        "SignatureVersion": "2"
      }

      //add options to the end of the query
  	  for(var key in opts){
  		   query[key] = opts[key];
  	  }

      return client.call(action, query, callback);
    }
  }
}
