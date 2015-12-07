
exports.init = init;

function init(genericAWSClient) {
  return createSecurityTokenServiceClient;
  
  function createSecurityTokenServiceClient(accessKeyId, secretAccessKey, options) {
    options = options || {};
    var client = genericAWSClient({
      host: options.host || "sts.amazonaws.com",
      path: options.path || "/",
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      secure: options.secure
    });

    return {
      client: client,
      call: call
    };

    function call(action, query, callback) {
      query["Action"] = action
      query["Version"] = options.version || '2011-06-15'
      query["SignatureMethod"] = "HmacSHA256"
      query["SignatureVersion"] = "2"
      return client.call(action, query, callback);
    }
  }
}
