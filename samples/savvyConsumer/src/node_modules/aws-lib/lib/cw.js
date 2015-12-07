
exports.init = init;

function init(genericAWSClient) {
  return createCloudWatchClient;

  function createCloudWatchClient(accessKeyId, secretAccessKey, options) {
    options = options || {};
    var aws = genericAWSClient({
      host: options.host || "monitoring.amazonaws.com",
      path: options.path || "/",
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      secure: options.secure,
      token: options.token
    });

    return {
      client: aws,
      call: call
    };

    function call(action, query, callback) {
      query["Action"] = action;
      query["Version"] = options.version || '2010-08-01';
      query["SignatureMethod"] = "HmacSHA256";
      query["SignatureVersion"] = "2";
      return aws.call(action, query, callback);
    }
  }
}
