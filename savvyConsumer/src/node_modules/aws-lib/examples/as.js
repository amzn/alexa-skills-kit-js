var aws = require("../lib/aws");

as = aws.createASlient(yourAccessKeyId, yourSecretAccessKey);

as.call("DescribeAutoScalingGroups", {}, function(err, result) {
  console.log(JSON.stringify(result));
})
