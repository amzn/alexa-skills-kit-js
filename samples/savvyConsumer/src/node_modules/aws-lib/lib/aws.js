
var http = require("http");
var https = require("https");
var qs = require("querystring");
var events = require("events");
var xml2js = require("xml2js");
var utils = require('./utils');
var _ = require('underscore');

// include specific API clients
var ec2 = require("./ec2");
var prodAdv = require("./prodAdv");
var simpledb = require("./simpledb");
var sqs = require("./sqs");
var sns = require("./sns");
var ses = require("./ses");
var elb = require("./elb");
var iam = require("./iam");
var sts = require("./sts");
var cw = require("./cw");
var as = require("./as");
var cfn = require("./cfn");
var emr = require("./emr");
var metadata = require("./metadata.js");

exports.createEC2Client = ec2.init(genericAWSClient);
exports.createProdAdvClient = prodAdv.init(genericAWSClient);
exports.createSimpleDBClient = simpledb.init(genericAWSClient);
exports.createSQSClient = sqs.init(genericAWSClient);
exports.createSNSClient = sns.init(genericAWSClient);
exports.createSESClient = ses.init(genericAWSClient);
exports.createELBClient = elb.init(genericAWSClient);
exports.createIAMClient = iam.init(genericAWSClient);
exports.createSTSClient = sts.init(genericAWSClient);
exports.createCWClient = cw.init(genericAWSClient);
exports.createASClient = as.init(genericAWSClient);
exports.createCFNClient = cfn.init(genericAWSClient);
exports.createEMRClient = emr.init(genericAWSClient);
exports.createMetaDataClient = metadata.init();

// a generic AWS API Client which handles the general parts
function genericAWSClient(obj) {
  var securityToken = obj.token;
  var signHeader = obj.signHeader;
  var host = obj.host;
  var accessKeyId = obj.accessKeyId;
  var path = obj.path;
  var agent = obj.agent;
  var secretAccessKey = obj.secretAccessKey;
  var secure = obj.secure == null ? true : false;
  var connection = secure ? https : http;

  return {call: call};

  function call(action, query, callback) {
    // Wrap the callback to prevent it from being called multiple times.
    callback = (function(next) {
      var isCalled = false;
      return function() {
        if (isCalled) return;
        isCalled = true;
        next.apply(null, arguments);
      }
    })(callback)
    
    // Try to set credentials with metadata API if no credentials provided
    metadata.readCredentials(obj, function(err) {
      if (err) return callback(err);
      var date = new Date();

      query = addQueryProperties(query, securityToken, accessKeyId, date);
      var body = qs.stringify(query);
      var headers = createHeaders(host, body.length, date, securityToken, accessKeyId, secretAccessKey);
      sendRequest();
      return;

      function sendRequest() {
        var options = {
          host: host,
          path: path,
          agent: agent,
          method: 'POST',
          headers: headers
        };
        var req = connection.request(options, function (res) {
          var data = '';
          //the listener that handles the response chunks
          res.addListener('data', function (chunk) {
            data += chunk.toString()
          })
          res.addListener('end', function() {
            var parser = new xml2js.Parser();
            parser.addListener('end', function(result) {
              if (typeof result != "undefined") {
                var err = result.Error || (result.Errors ? result.Errors.Error : null)
                if (err) {
                  callback(new Error(err.Message), result)
                } else {
                  callback(null, result)
                }
              } else {
                callback(new Error('Unable to parse XML from AWS.'))
              }
            });
            parser.parseString(data);
          })
          res.addListener('error', callback)
        });
        req.write(body)
        req.addListener('error', callback)
        req.end()
      }
    });
  }

  function addQueryProperties(query, securityToken, accessKeyId, date) {
    var extendedQuery = _.clone(query);
    if (securityToken) extendedQuery["SecurityToken"] = securityToken;
    extendedQuery["Timestamp"] = date.toISOString();
    extendedQuery["AWSAccessKeyId"] = accessKeyId;
    extendedQuery["Signature"] = signQuery(extendedQuery);
    return extendedQuery;
  }

  function createHeaders(host, bodyLength, date, securityToken, accessKeyId, secretAccessKey) {
    var headers = {
      "Host": host,
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      "Content-Length": bodyLength
    };

    if (signHeader) {
      headers["Date"] = date.toUTCString();
      if (securityToken !== undefined) headers["x-amz-security-token"] = securityToken;
      headers["x-amzn-authorization"] =
      "AWS3-HTTPS " +
      "AWSAccessKeyId=" + accessKeyId + ", " +
      "Algorithm=HmacSHA256, " +
      "Signature=" + utils.hmacSha256(secretAccessKey, date.toUTCString());
    }
    return headers;
  }

  function signQuery(query) {
    var keys = []
    var sorted = {}

    for(var key in query)
      keys.push(key)

    keys = keys.sort()

    for(var n in keys) {
      var key = keys[n]
      sorted[key] = query[key]
    }
    var stringToSign = ["POST", host, path, qs.stringify(sorted)].join("\n");

    // Amazon signature algorithm seems to require this
    stringToSign = stringToSign.replace(/!/g,"%21");
    stringToSign = stringToSign.replace(/'/g,"%27");
    stringToSign = stringToSign.replace(/\*/g,"%2A");
    stringToSign = stringToSign.replace(/\(/g,"%28");
    stringToSign = stringToSign.replace(/\)/g,"%29");

    return utils.hmacSha256(secretAccessKey, stringToSign);
  }
}
