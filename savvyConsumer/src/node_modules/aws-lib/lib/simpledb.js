
exports.init = init;

function init(genericAWSClient) {
  return createSimpleDBClient;

  function createSimpleDBClient(accessKeyId, secretAccessKey, options) {
    options = options || {};
    var client = genericAWSClient({
      host: options.host || "sdb.amazonaws.com",
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
      query["Action"] = action;
      query["Version"] = options.version || '2009-04-15';
      query["SignatureMethod"] = "HmacSHA256";
      query["SignatureVersion"] = "2";
      return client.call(action, query, callback);
    }
  }
}