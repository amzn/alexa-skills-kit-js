
assert = require('assert');
aws = require('../lib/aws');
credentials = require('./credentials');

var elb = aws.createELBClient(credentials.accessKeyId, credentials.secretAccessKey);

describe('elb', function() {
  describe('DescribeLoadBalancers', function() {
    it('should return all load balancers', function(done) {
      elb.call("DescribeLoadBalancers", {}, function(err, res) {
        assert.ok(res.DescribeLoadBalancersResult);
        done(err);
      })
    })
  })
})