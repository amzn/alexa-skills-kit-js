var aws = require("aws-lib");

elb = aws.createELBClient(yourAccessKeyId, yourSecretAccessKey);

elb.call("DescribeLoadBalancers", {}, function(err, result) {
  console.log(JSON.stringify(result, null, 2));
})
