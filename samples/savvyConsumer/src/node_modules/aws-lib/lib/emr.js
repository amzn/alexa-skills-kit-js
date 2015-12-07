
exports.init = init;

function init(genericAWSClient) {
  return createElasticMapReduceClient;
  function createElasticMapReduceClient(accessKeyId, secretAccessKey, options) {
    options = options || {};
    var client = genericAWSClient({
      host: options.host || "elasticmapreduce.amazonaws.com",
      path: options.path || "/",
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      secure: options.secure
    });

    return {
      client: aws,
      call: call
    };

    function call(action, query, callback) {
      query["Action"] = action
      query["Version"] = options.version || '2009-03-31'
      query["SignatureMethod"] = "HmacSHA256"
      query["SignatureVersion"] = "2"
      return client.call(action, query, callback);
    }
  }
}
