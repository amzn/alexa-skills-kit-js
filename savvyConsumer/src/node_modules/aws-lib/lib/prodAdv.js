
exports.init = init;

function init(genericAWSClient) {
  return createProdAdvClient;

  function createProdAdvClient(accessKeyId, secretAccessKey, associateTag, options) {
    options = options || {};
    var client = genericAWSClient({
      host: options.host || "ecs.amazonaws.com",
      path: options.path || "/onca/xml",
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      secure: options.secure
    });

    return {
      client: client,
      call: call
    };

    function call(action, query, callback) {
      query["Operation"] = action
      query["Service"] = "AWSECommerceService"
      query["Version"] = options.version || '2009-10-01'
      query["AssociateTag"] = associateTag;
      query["Region"] = options.region || "US"
      return client.call(action, query, callback);
    }
  }
}