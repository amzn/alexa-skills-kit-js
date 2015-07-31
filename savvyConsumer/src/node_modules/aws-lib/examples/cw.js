var aws = require("../lib/aws");

cw = aws.createCWClient(yourAccessKeyId, yourSecretAccessKey);

cw.call("ListMetrics", {}, function(err, result) {
  console.log(JSON.stringify(result));
})
