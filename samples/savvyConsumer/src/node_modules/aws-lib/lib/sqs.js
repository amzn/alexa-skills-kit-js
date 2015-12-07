
exports.init = init;

function init(genericAWSClient) {
  return createSimpleQueueServiceClient;

  function createSimpleQueueServiceClient(accessKeyId, secretAccessKey, options) {
    options = options || {};
    var client = genericAWSClient({
      host: options.host || "sqs.us-east-1.amazonaws.com",
      path: options.path || "/",
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      secure: options.secure,
      agent: options.agent,
      token: options.token
    });

    return {
      client: aws,
      call: call
    };

    function call(action, query, callback) {
      query["Action"] = action
      query["Version"] = options.version || '2011-10-01'
      query["SignatureMethod"] = "HmacSHA256"
      query["SignatureVersion"] = "2"
      return client.call(action, query, callback);
    }
  }
}
