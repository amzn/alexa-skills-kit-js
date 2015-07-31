
exports.init = init;

function init(genericAWSClient) {
  return createAutoScalingClient;

  function createAutoScalingClient(accessKeyId, secretAccessKey, options) {
    options = options || {};
    var client = genericAWSClient({
      host: options.host || "autoscaling.amazonaws.com",
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
      query["Action"] = action;
      query["Version"] = options.version || '2011-01-01';
      query["SignatureMethod"] = "HmacSHA256";
      query["SignatureVersion"] = "2";
      return client.call(action, query, callback);
    }
  }
}
