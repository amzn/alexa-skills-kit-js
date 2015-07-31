
exports.init = init;

function init(genericAWSClient) {
  return createELBClient;

  function createELBClient(accessKeyId, secretAccessKey, options) {
    options = options || {};

    var client = genericAWSClient({
      host: options.host || "elasticloadbalancing.amazonaws.com",
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

    function call(action, query, callback) {
      query["Action"] = action
      query["Version"] = options.version || '2010-07-01'
      query["SignatureMethod"] = "HmacSHA256"
      query["SignatureVersion"] = "2"
      return client.call(action, query, callback);
    }
    
  }
}
